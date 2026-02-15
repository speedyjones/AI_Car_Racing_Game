/* ========================= */
/* 🎮 GAME SETUP */
/* ========================= */

const gameArea = document.getElementById("gameArea");
const scoreDisplay = document.getElementById("score");

let score = 0;
let speed = 6;          // road + enemy speed
let moveSpeed = 15;     // horizontal car speed
let keys = {};          // track pressed keys

/* ========================= */
/* 🚗 CREATE PLAYER CAR */
/* ========================= */

let player = document.createElement("div");
player.className = "car";
player.innerHTML = `
  <div class="roof"></div>
  <div class="window front"></div>
  <div class="window back"></div>
  <div class="wheel left"></div>
  <div class="wheel right"></div>
`;
gameArea.appendChild(player);

// Initialize horizontal position in the middle
let playerX = (gameArea.clientWidth - player.clientWidth) / 2;
player.style.bottom = "20px"; // fixed vertical position
player.style.left = "0px";    // base left
player.style.transform = `translateX(${playerX}px)`;

/* ========================= */
/* 🛣 CREATE ROAD LINES */
/* ========================= */

let roadLines = [];
for (let i = 0; i < 5; i++) {
  let line = document.createElement("div");
  line.className = "roadLine";
  line.style.transform = `translateY(${i * 150}px)`;
  gameArea.appendChild(line);
  roadLines.push(line);
}

/* ========================= */
/* 🎮 CONTROLS */
document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

/* ========================= */
/* 🛣 MOVE ROAD LINES */
function moveLines() {
  roadLines.forEach(line => {
    // Get current Y
    let y = parseFloat(line.dataset.y) || parseFloat(line.style.transform.replace(/translateY\((.*)px\)/, '$1')) || 0;
    y += speed;
    if (y > 600) y = -100;
    line.style.transform = `translateY(${y}px)`;
    line.dataset.y = y;
  });
}

/* ========================= */
/* 🚙 ENEMY CARS */
let enemies = [];

function createEnemy() {
  let enemy = document.createElement("div");
  enemy.className = "enemy";

  let gameWidth = gameArea.clientWidth;
  let carWidth = 60; // enemy car width
  let x = Math.floor(Math.random() * (gameWidth - carWidth));

  enemy.style.transform = `translate(${x}px, -120px)`;
  enemy.dataset.x = x;
  enemy.dataset.y = -120;

  gameArea.appendChild(enemy);
  enemies.push(enemy);
}

// Spawn an enemy every 1.5 seconds
setInterval(createEnemy, 1500);

/* ========================= */
/* 🚙 MOVE ENEMIES */
function moveEnemies() {
  enemies.forEach((enemy, index) => {
    let y = parseFloat(enemy.dataset.y);
    y += speed;
    enemy.dataset.y = y;
    let x = parseFloat(enemy.dataset.x);
    enemy.style.transform = `translate(${x}px, ${y}px)`;

    // Remove enemy when off-screen
    if (y > 600) {
      enemy.remove();
      enemies.splice(index, 1);
      score += 10;
      scoreDisplay.innerText = "Score: " + score;
    }

    // Collision detection
    let playerRect = player.getBoundingClientRect();
    let enemyRect = enemy.getBoundingClientRect();

    if (
      playerRect.left < enemyRect.right &&
      playerRect.right > enemyRect.left &&
      playerRect.top < enemyRect.bottom &&
      playerRect.bottom > enemyRect.top
    ) {
      alert("Game Over! Score: " + score);
      location.reload();
    }
  });
}

/* ========================= */
/* 🚗 MOVE PLAYER */
function movePlayer() {
  if (keys["ArrowLeft"]) playerX -= moveSpeed;
  if (keys["ArrowRight"]) playerX += moveSpeed;

  // Boundaries
  let gameWidth = gameArea.clientWidth;
  let carWidth = player.clientWidth;
  if (playerX < 0) playerX = 0;
  if (playerX > gameWidth - carWidth) playerX = gameWidth - carWidth;

  player.style.transform = `translateX(${playerX}px)`;
}

/* ========================= */
/* 🔁 GAME LOOP */
function gameLoop() {
  moveLines();
  moveEnemies();
  movePlayer();
  requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop();
