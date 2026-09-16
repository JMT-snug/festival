// 모든 단계(index{N}.html) 페이지에서 공통으로 쓰는 로직.
// 각 페이지는 이 스크립트보다 먼저 `const STAGE_ID = N;`을 선언해야 함.

function showScreen(id) {
  document.querySelectorAll('.stage-screen').forEach((el) => el.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

document.querySelectorAll('.next-btn[data-next]').forEach((btn) => {
  btn.addEventListener('click', () => showScreen(btn.dataset.next));
});

document.querySelectorAll('.hint-btn').forEach((btn) => {
  const modal = document.getElementById(btn.dataset.hint);
  btn.addEventListener('click', () => modal.classList.add('active'));
});
document.querySelectorAll('.hint-close-btn').forEach((btn) => {
  btn.addEventListener('click', () => btn.closest('.modal').classList.remove('active'));
});

async function verifyAnswer(step, value) {
  const res = await fetch('/api/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ stageId: STAGE_ID, kind: 'answer', step, value }),
  });
  return res.json();
}

document.querySelectorAll('.answer-form').forEach((form) => {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const step = Number(form.dataset.step);
    const input = form.querySelector('.answer-input');
    const feedback = form.parentElement.querySelector('.answer-feedback');
    const value = input.value;

    feedback.textContent = '확인 중...';

    try {
      const data = await verifyAnswer(step, value);

      if (data.ok) {
        showScreen(form.dataset.next);
      } else {
        feedback.textContent = data.message || '정답이 아닙니다. 다시 시도해보세요.';
        input.select();
      }
    } catch (err) {
      feedback.textContent = '서버에 연결할 수 없습니다. 인터넷 연결을 확인해주세요.';
    }
  });
});

// 객관식 선택형 문제: 오답을 고르면 잠시 동안 다시 고를 수 없게 함
document.querySelectorAll('.mc-choices').forEach((group) => {
  const step = Number(group.dataset.step);
  const feedback = group.parentElement.querySelector('.answer-feedback');
  const buttons = group.querySelectorAll('.mc-btn');
  const LOCKOUT_SECONDS = 60;

  buttons.forEach((btn) => {
    btn.addEventListener('click', async () => {
      buttons.forEach((b) => (b.disabled = true));
      feedback.textContent = '확인 중...';

      try {
        const data = await verifyAnswer(step, btn.dataset.value);

        if (data.ok) {
          showScreen(group.dataset.next);
          return;
        }

        let remaining = LOCKOUT_SECONDS;
        feedback.textContent = `으악! ${remaining}초 후 다시 시도할 수 있습니다.`;
        const timer = setInterval(() => {
          remaining -= 1;
          if (remaining <= 0) {
            clearInterval(timer);
            feedback.textContent = '';
            buttons.forEach((b) => (b.disabled = false));
          } else {
            feedback.textContent = `으악! ${remaining}초 후 다시 시도할 수 있습니다.`;
          }
        }, 1000);
      } catch (err) {
        feedback.textContent = '서버에 연결할 수 없습니다. 인터넷 연결을 확인해주세요.';
        buttons.forEach((b) => (b.disabled = false));
      }
    });
  });
});
