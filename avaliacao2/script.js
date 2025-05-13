let segundos = 0;
let timerInterval;
let gamePaused = false;
let lives = 3;
let enemiesKilled = 0;
let currentPhase = 1;
let maxPhases = 4;
let player = document.getElementById("player");
let rockets = document.querySelectorAll(".rocketObj");
let rocketLaunched = [false, false];
let leftPosition = 50;

const timerElement = document.getElementById("timer");
const lifeElement = document.getElementById("life");
const aliensElement = document.getElementById("aliens");
const messageElement = document.getElementById("message");
const enemiesContainer = document.getElementById("enemies");

function initGame() {
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
      timerElement.textContent =
        `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}:${String(segundosRestantes).padStart(2, '0')}`;
    }
  }, 1000);
}

function handleInput(event) {
  if (gamePaused) return;

  if (event.key === 'a' && leftPosition > 5) {
    leftPosition -= 2;
    player.style.left = leftPosition + "%";
  }
  if (event.key === 'd' && leftPosition < 95) {
    leftPosition += 2;
    player.style.left = leftPosition + "%";
  }

  if (event.code === "Space") shootRocket();
  if (event.key === 'p') togglePause();
}

function togglePause() {
  gamePaused = !gamePaused;
  messageElement.textContent = gamePaused ? "PAUSED" : "";
  messageElement.style.display = gamePaused ? "block" : "none";
}

function shootRocket() {
  let index = rocketLaunched.indexOf(false);
  if (index === -1) return;

  rocketLaunched[index] = true;
  let rocket = rockets[index];
  rocket.style.display = "block";
  let bottom = 90;

  const interval = setInterval(() => {
    if (gamePaused) return;

    bottom += 2;
    rocket.style.bottom = bottom + "px";

    if (bottom > window.innerHeight) {
      clearInterval(interval);
      resetRocket(index);
    } else {
      // check collision
      document.querySelectorAll(".enemy").forEach(enemy => {
        const eRect = enemy.getBoundingClientRect();
        const rRect = rocket.getBoundingClientRect();
        if (
          rRect.left < eRect.right &&
          rRect.right > eRect.left &&
          rRect.top < eRect.bottom &&
          rRect.bottom > eRect.top
        ) {
          enemy.remove();
          clearInterval(interval);
          resetRocket(index);
          enemiesKilled++;
          aliensElement.textContent = `ALIEN: ${enemiesKilled}`;
          checkPhaseProgress();
        }
      });
    }
  }, 10);
}

function resetRocket(index) {
  rockets[index].style.bottom = "90px";
  rocketLaunched[index] = false;
}

function spawnEnemies() {
  enemiesContainer.innerHTML = '';
  for (let i = 0; i < 3; i++) {
    let enemy = document.createElement("img");
    enemy.src = "images/alien.png";
    enemy.classList.add("enemy");
    enemy.style.top = "-60px";
    enemy.style.left = `${30 + i * 100}px`;
    enemiesContainer.appendChild(enemy);
    moveEnemy(enemy);
  }
}

function moveEnemy(enemy) {
  let top = -60;
  const speed = 0.3 + currentPhase * 0.2;

  const interval = setInterval(() => {
    if (gamePaused) return;

    top += speed;
    enemy.style.top = top + "px";

    if (top > window.innerHeight - 100) {
      clearInterval(interval);
      loseLife();
    }
  }, 20);
}

function loseLife() {
  lives--;
  lifeElement.textContent = `LIFE: ${lives}`;
  gamePaused = true;
  messageElement.textContent = "YOU LOSE";
  messageElement.style.display = "block";

  setTimeout(() => {
    messageElement.style.display = "none";
    gamePaused = false;
    if (lives <= 0) {
      endGame(false);
    } else {
      spawnEnemies();
    }
  }, 2000);
}

function checkPhaseProgress() {
  if (enemiesKilled % 3 === 0) {
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
  let bgExtension = currentPhase === 1 ? 'png' : 'jpg';
  document.body.style.backgroundImage = `url(images/background${currentPhase}.${bgExtension})`;
}

function endGame(victory) {
  gamePaused = true;
  messageElement.textContent = victory ? "YOU WIN" : "GAME OVER";
  messageElement.style.display = "block";
  clearInterval(timerInterval);
}
