function showScreen(id) {
  document.querySelectorAll('.stage-screen').forEach((el) => el.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

document.getElementById('detective-arrive-btn').addEventListener('click', () => {
  showScreen('stage-todo');
});
