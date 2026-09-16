const STAGE_ID = 1;

function showScreen(id) {
  document.querySelectorAll('.stage-screen').forEach((el) => el.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

const video = document.getElementById('envelope-video');
video.addEventListener('ended', () => showScreen('stage-letter1'));
// 자동재생이 브라우저 정책으로 막혔을 경우를 대비해, 영상을 눌러도 다음으로 넘어가게 함
video.addEventListener('click', () => showScreen('stage-letter1'));

document.querySelectorAll('.next-btn').forEach((btn) => {
  btn.addEventListener('click', () => showScreen(btn.dataset.next));
});

const hintModal = document.getElementById('hint-modal');
document.getElementById('hint-btn').addEventListener('click', () => {
  hintModal.classList.add('active');
});
document.getElementById('hint-close-btn').addEventListener('click', () => {
  hintModal.classList.remove('active');
});

document.getElementById('answer-form').addEventListener('submit', async (event) => {
  event.preventDefault();

  const input = document.getElementById('answer-input');
  const feedback = document.getElementById('answer-feedback');
  const value = input.value;

  feedback.textContent = '확인 중...';

  try {
    const res = await fetch('/api/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stageId: STAGE_ID, kind: 'answer', value }),
    });
    const data = await res.json();

    if (data.ok) {
      document.getElementById('next-location').textContent = data.nextLocationText || '';
      document.getElementById('next-password').textContent = data.nextPassword
        ? `다음 비밀번호: ${data.nextPassword}`
        : '';
      showScreen('stage-result');
    } else {
      feedback.textContent = data.message || '정답이 아닙니다. 다시 시도해보세요.';
      input.select();
    }
  } catch (err) {
    feedback.textContent = '서버에 연결할 수 없습니다. 인터넷 연결을 확인해주세요.';
  }
});
