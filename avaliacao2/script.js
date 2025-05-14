let segundos = 0;
let timerInterval;
let gamePaused = false;
let lives = 3;
let enemiesKilled = 0;
let currentPhase = 1;
const maxPhases = 4;
let enemySpeed = 1;
let enemyInterval;

const PLAYER_SIZE = 100;
const ENEMY_SIZE = 90;
const ENEMY_SPACING = 150;

const timerElement = document.getElementById("timer");
const lifeElement = document.getElementById("life");
const aliensElement = document.getElementById("aliens");
const messageElement = document.getElementById("message");
const enemiesContainer = document.getElementById("enemies");
const player = document.getElementById("player");
const rockets = {
  left: document.querySelector(".rocketObj.left"),
  right: document.querySelector(".rocketObj.right")
};

const velocidade = 1;
let posicaoNave = 50;
const limiteEsquerda = 5;
const limiteDireita = 95;

let estadoDisparo = 0;
let missilEsqAtivo = false;
let missilDirAtivo = false;
const alturaDeRepouso = 6;
const alturaMaxima = 87;

function initGame() {
  document.body.style.backgroundImage = 'url("images/background1.jpg")';
  document.addEventListener('keydown', handleInput);
  startTimer();
  spawnEnemies();
}

function startTimer() {
  timerInterval = setInterval(() => {
    if (!gamePaused) {
      segundos++;
      const horas = Math.floor(segundos / 3600);
      const minutos = Math.floor((segundos % 3600) / 60);
      const segundosRestantes = segundos % 60;
      timerElement.textContent = `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}:${String(segundosRestantes).padStart(2, '0')}`;
    }
  }, 1000);
}

function handleInput(e) {
  if (e.key === 'p' || e.key === 'P') {
    togglePause();
    return;
  }
  
  if (gamePaused) return;

  if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
    if (posicaoNave > limiteEsquerda) {
      posicaoNave -= velocidade;
      player.style.left = `${posicaoNave}%`;
      if (!missilEsqAtivo) rockets.left.style.left = `${posicaoNave + 0.5}%`;
      if (!missilDirAtivo) rockets.right.style.left = `${posicaoNave + 5.1}%`;
    }
  } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
    if (posicaoNave < limiteDireita) {
      posicaoNave += velocidade;
      player.style.left = `${posicaoNave}%`;
      if (!missilEsqAtivo) rockets.left.style.left = `${posicaoNave + 0.5}%`;
      if (!missilDirAtivo) rockets.right.style.left = `${posicaoNave + 5.1}%`;
    }
  }

  if (e.code === "Space") dispararMissel();
}

function togglePause() {
  gamePaused = !gamePaused;
  messageElement.textContent = gamePaused ? "PAUSED" : "";
  messageElement.style.display = gamePaused ? "block" : "none";
}

function dispararMissel() {
  if (gamePaused || estadoDisparo === 2) return;

  if (estadoDisparo === 0 && !missilEsqAtivo) {
    missilEsqAtivo = true;
    dispararMissil(rockets.left, () => estadoDisparo = 1);
  } else if (estadoDisparo === 1 && !missilDirAtivo) {
    missilDirAtivo = true;
    dispararMissil(rockets.right, () => estadoDisparo = 2);
  }
}

function dispararMissil(missil, aoFinalizar) {
  let altura = alturaDeRepouso;
  const intervalo = setInterval(() => {
    if (gamePaused) return;

    if (altura >= alturaMaxima) {
      clearInterval(intervalo);
      missil.style.bottom = `${alturaMaxima}vh`;
      if (missil === rockets.left) resetRocket('left');
      if (missil === rockets.right) resetRocket('right');
      if (typeof aoFinalizar === "function") aoFinalizar();
    } else {
      altura += 1.5;
      missil.style.bottom = `${altura}vh`;
      const enemies = document.querySelectorAll(".enemy");
      enemies.forEach(enemy => {
        if (checkCollision(missil, enemy)) {
          enemy.remove();
          clearInterval(intervalo);
          enemiesKilled++;
          aliensElement.textContent = `ALIEN: ${enemiesKilled}`;
          resetRocket(missil === rockets.left ? 'left' : 'right');
          checkPhaseProgress();
        }
      });
    }
  }, 10);
}

function resetRocket(side) {
  if (side === 'left') {
    rockets.left.style.bottom = `${alturaDeRepouso}vh`;
    missilEsqAtivo = false;
  } else {
    rockets.right.style.bottom = `${alturaDeRepouso}vh`;
    missilDirAtivo = false;
  }
  if (!missilEsqAtivo && !missilDirAtivo) estadoDisparo = 0;
}

function spawnEnemies() {
  enemiesContainer.innerHTML = '';
  const containerWidth = window.innerWidth;
  const startX = (containerWidth - (3 * ENEMY_SPACING - (ENEMY_SPACING - ENEMY_SIZE))) / 2;
  
  for (let i = 0; i < 3; i++) {
    let enemy = document.createElement("img");
    enemy.src = "images/alien.png";
    enemy.classList.add("enemy");
    enemy.style.width = `${ENEMY_SIZE}px`;
    enemy.style.height = `${ENEMY_SIZE}px`;
    enemy.style.top = "-100px";
    enemy.style.left = `${startX + i * ENEMY_SPACING}px`;
    enemiesContainer.appendChild(enemy);
    const currentSpeed = enemySpeed + (currentPhase * 0.5);
    moveEnemy(enemy, currentSpeed);
  }
}

function moveEnemy(enemy, speed) {
  let top = -100;

  const interval = setInterval(() => {
    if (gamePaused) return;

    top += speed;
    enemy.style.top = `${top}px`;

    if (checkCollision(enemy, player)) {
      clearInterval(interval);
      enemy.remove();
      loseLife();
      return;
    }

    if (top > window.innerHeight) {
      clearInterval(interval);
      enemy.remove();
    }
  }, 20);
}

function checkCollision(el1, el2) {
  const r1 = el1.getBoundingClientRect();
  const r2 = el2.getBoundingClientRect();
  return !(r1.right < r2.left || 
           r1.left > r2.right || 
           r1.bottom < r2.top || 
           r1.top > r2.bottom);
}

function loseLife() {
  lives--;
  lifeElement.textContent = `LIFE: ${lives}`;
  gamePaused = true;
  messageElement.textContent = "YOU LOSE";
  messageElement.style.display = "block";

  setTimeout(() => {
    if (lives <= 0) {
      endGame(false);
    } else {
      messageElement.style.display = "none";
      gamePaused = false;
      spawnEnemies();
    }
  }, 2000);
}

function checkPhaseProgress() {
  const enemiesRemaining = document.querySelectorAll(".enemy").length;
  if (enemiesRemaining === 0) {
    if (currentPhase < maxPhases) {
      currentPhase++;
      changeBackground();
      spawnEnemies();
    } else {
      endGame(true);
    }
  }
}

function changeBackground() {
  document.body.style.backgroundImage = `url('images/background${currentPhase}.jpg')`;
}

function endGame(victory) {
  gamePaused = true;
  messageElement.textContent = victory ? "YOU WIN" : "GAME OVER";
  messageElement.style.display = "block";
  clearInterval(timerInterval);
  document.removeEventListener('keydown', handleInput);
}