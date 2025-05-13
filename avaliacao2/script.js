// Variáveis globais
let segundos = 0;
let timerInterval;
let gamePaused = false;
let lives = 3;
let enemiesKilled = 0;
let currentPhase = 1;
let maxPhases = 4;
let enemySpeed = 0.3;
let enemyInterval = 2000;

// Elementos DOM
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

// Configurações de movimento
const velocidade = 0.75;
let posicaoNave = 50;
const limiteEsquerda = 5;
const limiteDireita = 95;

// Estados dos mísseis
let estadoDisparo = 0;
let missilEsqAtivo = false;
let missilDirAtivo = false;
const alturaDeRepouso = 6;
const alturaMaxima = 87;

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
      timerElement.textContent = `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}:${String(segundosRestantes).padStart(2, '0')}`;
    }
  }, 1000);
}

function handleInput(e) {
  if (gamePaused) return;

  // Movimento da nave
  if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
    if (posicaoNave > limiteEsquerda) {
      posicaoNave -= velocidade;
      player.style.left = `${posicaoNave}%`;
      
      // Atualiza posição dos mísseis quando não estão ativos
      if (!missilEsqAtivo) {
        rockets.left.style.left = `${posicaoNave + 0.5}%`;
      }
      if (!missilDirAtivo) {
        rockets.right.style.left = `${posicaoNave + 5.1}%`;
      }
    }
  } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
    if (posicaoNave < limiteDireita) {
      posicaoNave += velocidade;
      player.style.left = `${posicaoNave}%`;
      
      // Atualiza posição dos mísseis quando não estão ativos
      if (!missilEsqAtivo) {
        rockets.left.style.left = `${posicaoNave + 0.5}%`;
      }
      if (!missilDirAtivo) {
        rockets.right.style.left = `${posicaoNave + 5.1}%`;
      }
    }
  }

  // Disparo de mísseis
  if (e.code === "Space") {
    dispararMissel();
  }

  // Pausar jogo
  if (e.key === 'p' || e.key === 'P') {
    togglePause();
  }
}

function togglePause() {
  gamePaused = !gamePaused;
  messageElement.textContent = gamePaused ? "PAUSED" : "";
  messageElement.style.display = gamePaused ? "block" : "none";
}

function dispararMissel() {
  if (gamePaused) return;

  if (estadoDisparo === 0 && !missilEsqAtivo) {
    missilEsqAtivo = true;
    dispararMissil(rockets.left, alturaDeRepouso, () => {
      estadoDisparo = 1;
    });
  } else if (estadoDisparo === 1 && !missilDirAtivo) {
    missilDirAtivo = true;
    dispararMissil(rockets.right, alturaDeRepouso, () => {
      estadoDisparo = 2;
    });
  } else if (estadoDisparo === 2) {
    resetBothRockets();
    estadoDisparo = 0;
  }
}

function dispararMissil(missil, alturaInicial, aoFinalizar) {
  let altura = alturaInicial;
  const intervalo = setInterval(() => {
    if (gamePaused) return;

    if (altura >= alturaMaxima) {
      clearInterval(intervalo);
      missil.style.bottom = `${alturaMaxima}vh`;
      if (typeof aoFinalizar === "function") {
        aoFinalizar();
      }
    } else {
      altura += 1;
      missil.style.bottom = `${altura}vh`;
      
      // Verificar colisão com inimigos
      const enemies = document.querySelectorAll(".enemy");
      enemies.forEach(enemy => {
        if (checkCollision(missil, enemy)) {
          enemy.remove();
          clearInterval(intervalo);
          enemiesKilled++;
          aliensElement.textContent = `ALIEN: ${enemiesKilled}`;
          checkPhaseProgress();
          
          // Resetar o míssil que atingiu
          if (missil === rockets.left) {
            resetRocket('left');
          } else {
            resetRocket('right');
          }
        }
      });
    }
  }, 10);
}

function resetRocket(side) {
  if (side === 'left') {
    rockets.left.style.bottom = `${alturaDeRepouso}vh`;
    rockets.left.style.left = `${posicaoNave + 0.5}%`;
    missilEsqAtivo = false;
  } else {
    rockets.right.style.bottom = `${alturaDeRepouso}vh`;
    rockets.right.style.left = `${posicaoNave + 5.1}%`;
    missilDirAtivo = false;
  }
}

function resetBothRockets() {
  resetRocket('left');
  resetRocket('right');
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
  const speed = enemySpeed + currentPhase * 0.2;

  const interval = setInterval(() => {
    if (gamePaused) return;

    top += speed;
    enemy.style.top = `${top}px`;

    // Verificar colisão com o jogador
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
  return (
    r1.left < r2.right &&
    r1.right > r2.left &&
    r1.top < r2.bottom &&
    r1.bottom > r2.top
  );
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
  if (enemiesKilled % 3 === 0 && enemiesKilled > 0) {
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
  document.body.style.backgroundImage = `url(images/background${currentPhase}.${currentPhase === 1 ? 'png' : 'jpg'})`;
}

function endGame(victory) {
  gamePaused = true;
  messageElement.textContent = victory ? "YOU WIN" : "GAME OVER";
  messageElement.style.display = "block";
  clearInterval(timerInterval);
}