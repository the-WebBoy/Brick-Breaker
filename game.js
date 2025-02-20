// game.js - Enhanced Smooth Animation & Realistic Physics + Mobile Support
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Responsive Canvas
canvas.width = window.innerWidth * 0.9;
canvas.height = window.innerHeight * 0.7;

// Game Variables
const paddleHeight = 10, paddleWidth = canvas.width * 0.2;
let paddleX = (canvas.width - paddleWidth) / 2;
let rightPressed = false, leftPressed = false;

const ballRadius = 7;
let ballX = canvas.width / 2, ballY = canvas.height - 40;
let ballDX = 4, ballDY = -4;
let speedMultiplier = 1.05; // Ball speed increases slightly per hit

const brickRowCount = 8, brickColumnCount = 10;
const brickWidth = canvas.width / brickColumnCount - 5, brickHeight = 20, brickPadding = 5;
const brickOffsetTop = 30, brickOffsetLeft = 15;
let bricks = [];

// Define brick colors for the pattern
const brickColors = ["#ff9800", "#9c27b0", "#ffeb3b", "#03a9f4"];

for (let c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (let r = 0; r < brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1, color: brickColors[r % brickColors.length] };
  }
}

let lives = 3;
let score = 0;

// Event Listeners
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth * 0.9;
  canvas.height = window.innerHeight * 0.7;
});
document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);
document.addEventListener("mousemove", mouseMoveHandler);
document.addEventListener("touchmove", touchMoveHandler);

function keyDownHandler(e) {
  if (e.key === "Right" || e.key === "ArrowRight") rightPressed = true;
  else if (e.key === "Left" || e.key === "ArrowLeft") leftPressed = true;
}

function keyUpHandler(e) {
  if (e.key === "Right" || e.key === "ArrowRight") rightPressed = false;
  else if (e.key === "Left" || e.key === "ArrowLeft") leftPressed = false;
}

function mouseMoveHandler(e) {
  let relativeX = e.clientX - canvas.offsetLeft;
  if (relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - paddleWidth / 2;
  }
}

function touchMoveHandler(e) {
  let touchX = e.touches[0].clientX;
  paddleX = touchX - paddleWidth / 2;
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#e91e63";
  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight - 10, paddleWidth, paddleHeight);
  ctx.fillStyle = "#e91e63";
  ctx.fill();
  ctx.closePath();
}

function drawBricks() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status === 1) {
        let brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        let brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = bricks[c][r].color;
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function collisionDetection() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      let b = bricks[c][r];
      if (b.status === 1) {
        if (ballX > b.x && ballX < b.x + brickWidth && ballY > b.y && ballY < b.y + brickHeight) {
          ballDY = -ballDY * speedMultiplier;
          b.status = 0;
          score += 10;
        }
      }
    }
  }
}

function drawScore() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#fff";
  ctx.fillText("Score: " + score, 10, 20);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  drawBall();
  drawPaddle();
  drawScore();
  collisionDetection();

  if (ballX + ballDX > canvas.width - ballRadius || ballX + ballDX < ballRadius) {
    ballDX = -ballDX;
  }
  if (ballY + ballDY < ballRadius) {
    ballDY = -ballDY;
  } else if (ballY + ballDY > canvas.height - ballRadius) {
    if (ballX > paddleX && ballX < paddleX + paddleWidth) {
      let hitAngle = ((ballX - (paddleX + paddleWidth / 2)) / paddleWidth) * 2;
      ballDX = hitAngle * 5;
      ballDY = -ballDY;
    } else {
      lives--;
      if (!lives) {
        alert("Game Over");
        document.location.reload();
      } else {
        ballX = canvas.width / 2;
        ballY = canvas.height - 40;
        ballDX = 4;
        ballDY = -4;
        paddleX = (canvas.width - paddleWidth) / 2;
      }
    }
  }

  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += 8;
  } else if (leftPressed && paddleX > 0) {
    paddleX -= 8;
  }

  ballX += ballDX;
  ballY += ballDY;
  requestAnimationFrame(draw);
}

draw();
