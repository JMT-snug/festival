const STAGE_ID = 3;

const PRIZE_COUNT = 3;
const RETURN_DELAY_MS = 30000;

document.getElementById('stage-celebrate').addEventListener('stagescreen:show', () => {
  const prizeNumber = 1 + Math.floor(Math.random() * PRIZE_COUNT);
  document.getElementById('prize-image').src = `/assets/stage3/prize${prizeNumber}.png`;

  document.getElementById('sfx-firework').play().catch(() => {});
  document.getElementById('sfx-applause').play().catch(() => {});

  setTimeout(() => showScreen('stage-intro'), RETURN_DELAY_MS);
});
