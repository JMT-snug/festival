const STAGE_ID = 1;

const video = document.getElementById('envelope-video');
video.addEventListener('ended', () => showScreen('stage-letter1'));
// 영상이 끝나기 전에 눌러도 다음으로 넘어갈 수 있게 함
video.addEventListener('click', () => showScreen('stage-letter1'));

document.getElementById('detective-arrive-btn').addEventListener('click', () => {
  showScreen('stage-video');
  video.play();
});
