const STAGE_ID = 1;

function showScreen(id) {
  document.querySelectorAll('.stage-screen').forEach((el) => el.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

const video = document.getElementById('envelope-video');
video.addEventListener('ended', () => showScreen('stage-letter1'));
// 영상이 끝나기 전에 눌러도 다음으로 넘어갈 수 있게 함
video.addEventListener('click', () => showScreen('stage-letter1'));

document.getElementById('detective-arrive-btn').addEventListener('click', () => {
  showScreen('stage-video');
  video.play();
});

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

document.querySelectorAll('.answer-form').forEach((form) => {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const step = Number(form.dataset.step);
    const input = form.querySelector('.answer-input');
    const feedback = form.parentElement.querySelector('.answer-feedback');
    const value = input.value;

    feedback.textContent = '확인 중...';

    try {
      const res = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stageId: STAGE_ID, kind: 'answer', step, value }),
      });
      const data = await res.json();

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
