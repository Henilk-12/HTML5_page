const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const MAP_SIZE = 20;     
const BLOCK_SIZE = 20;   
let score = 0;
let gameInterval;
let directionQueue = []; 

let snake = {
  body: [{ x: MAP_SIZE / 2, y: MAP_SIZE / 2 }],
  size: 5,
  direction: { x: 0, y: -1 },

  moveSnake: function () {

    if (directionQueue.length > 0) {
      const nextDir = directionQueue.shift();

      if (!(nextDir.x === -this.direction.x && nextDir.y === -this.direction.y)) {
        this.direction = nextDir;
      }
    }

    const newBlock = {
      x: this.body[0].x + this.direction.x,
      y: this.body[0].y + this.direction.y
    };

    this.body.unshift(newBlock);
    while (this.body.length > this.size) this.body.pop();
  },

  drawSnake: function () {
    this.moveSnake();
    ctx.fillStyle = 'lime';
    for (let i = 0; i < this.body.length; i++) {
      ctx.fillRect(
        this.body[i].x * BLOCK_SIZE,
        this.body[i].y * BLOCK_SIZE,
        BLOCK_SIZE,
        BLOCK_SIZE
      );
    }
  }
};

let apple = {
  x: 5, y: 5,
  drawApple: function () {
    ctx.fillStyle = 'red';
    ctx.fillRect(
      this.x * BLOCK_SIZE,
      this.y * BLOCK_SIZE,
      BLOCK_SIZE,
      BLOCK_SIZE
    );
  },
  putApple: function () {
    this.x = Math.floor(Math.random() * MAP_SIZE);
    this.y = Math.floor(Math.random() * MAP_SIZE);
  }
};

function drawMap() {
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function eatApple() {
  if (snake.body[0].x === apple.x && snake.body[0].y === apple.y) {
    snake.size += 1;
    score++;
    document.getElementById("score").innerText = "Score: " + score;
    apple.putApple();
  }
}

function checkDeath() {
  if (
    snake.body[0].x < 0 ||
    snake.body[0].x >= MAP_SIZE ||
    snake.body[0].y < 0 ||
    snake.body[0].y >= MAP_SIZE
  ) {
    clearInterval(gameInterval);
    alert("Game Over! Your Score: " + score);
  }
  for (let i = 1; i < snake.body.length; i++) {
    if (
      snake.body[0].x === snake.body[i].x &&
      snake.body[0].y === snake.body[i].y
    ) {
      clearInterval(gameInterval);
      alert("Game Over! Your Score: " + score);
    }
  }
}

function drawGame() {
  drawMap();
  apple.drawApple();
  snake.drawSnake();
  eatApple();
  checkDeath();
}

function gameStart() {
  clearInterval(gameInterval);
  score = 0;
  document.getElementById("score").innerText = "Score: " + score;
  directionQueue = [];

  snake = {
    body: [{ x: MAP_SIZE / 2, y: MAP_SIZE / 2 }],
    size: 5,
    direction: { x: 0, y: -1 },
    moveSnake: snake.moveSnake,
    drawSnake: snake.drawSnake
  };

  apple.putApple();
  gameInterval = setInterval(drawGame, 100);
}


function keyDown(event) {
  let newDir = null;

  if (event.keyCode == 38 || event.keyCode == 87) newDir = { x: 0, y: -1 }; // 上
  else if (event.keyCode == 40 || event.keyCode == 83) newDir = { x: 0, y: 1 }; // 下
  else if (event.keyCode == 37 || event.keyCode == 65) newDir = { x: -1, y: 0 }; // 左
  else if (event.keyCode == 39 || event.keyCode == 68) newDir = { x: 1, y: 0 }; // 右

  if (newDir) directionQueue.push(newDir);
}

document.addEventListener("keydown", keyDown);
document.getElementById("buttonStart").addEventListener("click", gameStart);