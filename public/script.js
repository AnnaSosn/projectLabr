const $circle = document.querySelector('#circle');
const $score = document.querySelector('#score');
const leaderboard = document.querySelector('#leaderboard tbody');
const resetScoreBtn = document.getElementById('resetScoreBtn');

let playerName = '';


function start() {
  setScore(getScore());
  setImage();
}


function setScore(score) {
  localStorage.setItem('score', score);
  $score.textContent = score;
}


function setImage() {
  if (getScore() >= 50) {
    $circle.setAttribute('src', './img/labr2.png');
  }
  if (getScore() >= 150) {
    $circle.setAttribute('src', './img/labr3.png');
  }
}


function getScore() {
  const score = Number(localStorage.getItem('score'));
  return isNaN(score) ? 0 : score;
}


function addOne() {
  setScore(getScore() + 1);
  setImage();
}


$circle.addEventListener('click', (event) => {
  const rect = event.target.getBoundingClientRect();
  const offsetX = event.clientX - (rect.left + rect.width / 2);
  const offsetY = event.clientY - (rect.top + rect.height / 2);

  const DEG = 60;
  const tiltX = (offsetY / rect.height) * DEG;
  const tiltY = (offsetX / rect.width) * -DEG;

  $circle.style.setProperty('--tiltX', `${tiltX}deg`);
  $circle.style.setProperty('--tiltY', `${tiltY}deg`);

  setTimeout(() => {
    $circle.style.setProperty('--tiltX', `0deg`);
    $circle.style.setProperty('--tiltY', `0deg`);
  }, 300);

  const plusOne = document.createElement('div');
  plusOne.classList.add('plus-one');
  plusOne.textContent = '+1';
  plusOne.style.left = `${event.clientX - rect.left}px`;
  plusOne.style.top = `${event.clientY - rect.top}px`;

  $circle.parentElement.appendChild(plusOne);

  addOne();

  setTimeout(() => {
    plusOne.remove();
  }, 2000);
});


const clickSound = new Audio('./sounds/click.mp3');
const levelUpSound = new Audio('./sounds/next-level.mp3');

$circle.addEventListener('click', (event) => {
  clickSound.play(); 
  addOne();
  if (getScore() % 50 === 0) { 
    levelUpSound.play();
  }
});


let seconds = 0;
let timerInterval;

function startTimer() {
  timerInterval = setInterval(() => {
    seconds++;
    document.getElementById('timer').textContent = `Time: ${seconds}s`;
  }, 1000);
}


function showGreeting(name) {
  const greetingDiv = document.getElementById('greeting');
  greetingDiv.textContent = `Привіт, ${name}! Бажаю гарної гри!`;
}


function getUserData() {
  const name = prompt("Введіть своє ім'я:");
  if (name) {
    playerName = name;
    showGreeting(name);
    loadLeaderboard();
  } else {
    alert("Будь ласка, введіть дані.");
  }
}


function resetScore() {
  const score = getScore();
  if (score > 0) {
    saveToLeaderboard(playerName, score);
  }
  localStorage.setItem('score', 0);
  $score.textContent = '0';


 $circle.setAttribute('src', './img/labr1.png');
}


function saveToLeaderboard(name, score) {
  let leaderboardData = JSON.parse(localStorage.getItem('leaderboard')) || [];
  leaderboardData.push({ name, score });
  localStorage.setItem('leaderboard', JSON.stringify(leaderboardData));
  loadLeaderboard();
}


function loadLeaderboard() {
  let leaderboardData = JSON.parse(localStorage.getItem('leaderboard')) || [];
  leaderboard.innerHTML = '';
  leaderboardData.forEach(entry => {
    const row = document.createElement('tr');
    row.innerHTML = `<td>${entry.name}</td><td>${entry.score}</td>`;
    leaderboard.appendChild(row);
  });
}


resetScoreBtn.addEventListener('click', resetScore);


window.addEventListener('load', () => {
  getUserData();  
  startTimer();  
  start();  
});
