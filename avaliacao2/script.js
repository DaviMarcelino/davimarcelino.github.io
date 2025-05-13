let segundos = 0;
const timerElement = document.getElementById('timer');

function atualizarTimer() {
    const horas = Math.floor(segundos / 3600);
    const minutos = Math.floor((segundos % 3600) / 60);
    const segundosRestantes = segundos % 60;

    timerElement.textContent =
    `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}:${String(segundosRestantes).padStart(2, '0')}`;

    segundos++;
}

// Atualiza a cada segundo
setInterval(atualizarTimer, 1000);

let player = document.getElementById("player");
let leftPosition = 50;

function movePlayer() {
    document.addEventListener('keypress', function(event) {
        if (event.key === 'a' || event.key === 'A') {   
            if(leftPosition <= 12) {
                return;
            }
            leftPosition -= 1; // move left by 10px
            player.style.left = leftPosition + "%";
        } else if (event.key === 'd' || event.key === 'D') {
            if(leftPosition >= 88) {
                return;
            }
            leftPosition += 1; // move right by 10px
            player.style.left = leftPosition + "%";
        }
    });
}

function shootRocket() {
    const rocketObj = document.getElementById("rocketObj");
    let bottomPosition = 0;

    document.addEventListener('keydown', function(event) {
        if (event.code === "Space") {
            let interval = setInterval(function() {
                if (bottomPosition >= 600) {
                    clearInterval(interval);
                } else {
                    bottomPosition++;
                    rocketObj.style.bottom = bottomPosition + "%";
                }
            }, 1); // Adjust time for speed
        }
    }); 
}

shootRocket();
movePlayer();