let subPos;
let subVel;
let obstacles = [];
let wallThickness = 40;
let gif;
let gifDisplayed = false;
let subImg;
let deathCount = 0;
let gameStarted = false;

function preload() {
  subImg = loadImage('submarine.png');
}

function setup() {
  createCanvas(600, 600);
  setupGame();
  gif = createImg('https://media1.tenor.com/m/z6HrXSWAouAAAAAC/cuphead-meme.gif');
  gif.hide();
}

function draw() {
  background(0);

  if (!gameStarted) {
    showStartScreen();
    return;
  }

  background(0, 0, 50);
  subPos.x = constrain(subPos.x, 25, width - 25);
  subPos.y = constrain(subPos.y, 15, height - 15);

  fill(0, 40, 40);
  for (let i = 0; i < obstacles.length; i++) {
    if (obstacles[i].type !== 'moving') {
      rect(obstacles[i].x, obstacles[i].y, obstacles[i].w, obstacles[i].h);
    } else {
      fill(40, 0, 0);
      obstacles[i].pos.x += obstacles[i].speed * obstacles[i].direction;
      if (obstacles[i].pos.x <= 50 || obstacles[i].pos.x >= width - 50) {
        obstacles[i].direction *= -1;
      }
      ellipse(obstacles[i].pos.x, obstacles[i].pos.y, obstacles[i].size);
    }
  }

  fill(255);
  beginShape();
  vertex(400, height);
  vertex(580, height);
  vertex(550, height - 100);
  vertex(150, height - 100);
  endShape();

  imageMode(CENTER);
  image(subImg, subPos.x, subPos.y, 50, 30);

  if (keyIsDown(UP_ARROW)) {
    subVel.y = -2;
  } else if (keyIsDown(DOWN_ARROW)) {
    subVel.y = 2;
  } else {
    subVel.y = 0;
  }

  if (keyIsDown(LEFT_ARROW)) {
    subVel.x = -2;
  } else if (keyIsDown(RIGHT_ARROW)) {
    subVel.x = 2;
  } else {
    subVel.x = 0;
  }

  subPos.add(subVel);

  for (let i = 0; i < obstacles.length; i++) {
    if (obstacles[i].type !== 'moving') {
      if (collidesWithWall(subPos, obstacles[i])) {
        resetSub();
      }
    } else {
      let d = dist(subPos.x, subPos.y, obstacles[i].pos.x, obstacles[i].pos.y);
      if (d < 25 + obstacles[i].size / 2) {
        resetSub();
      }
    }
  }

  if (subPos.x > 150 && subPos.x < 580 && subPos.y > height - 120 && subPos.y < height - 80) {
    if (!gifDisplayed) {
      gif.show();
      gif.position(width / 2 - gif.width / 2, height / 2 - gif.height / 2);
      gifDisplayed = true;
    }
  } else {
    if (gifDisplayed) {
      gif.hide();
      gifDisplayed = false;
    }
  }

  // Contador de mortes
  fill(255);
  textSize(20);
  textAlign(LEFT, TOP);
  text(`Mortes: ${deathCount}`, 10, 10);
}

function mortesDemais() {

}

function setupGame() {
  subPos = createVector(width / 2, 0);
  subVel = createVector(0, 0);
  obstacles = [];

  obstacles.push(createWall(10, 90, 320, 20));
  obstacles.push(createWall(250, 180, 20, 300));
  obstacles.push(createWall(120, 180, 20, 300));
  obstacles.push(createWall(410, 90, 200, 20));
  obstacles.push(createWall(250, 180, 200, 20));
  obstacles.push(createWall(10, 500, 90, 20));

  for (let i = 0; i < 6; i++) {
    let x = random(100, width - 100);
    let y = random(100, height - 200);
    let size = random(15, 25);
    let speed = random(1, 4);
    obstacles.push({
      pos: createVector(x, y),
      size: size,
      speed: speed,
      direction: random() > 0.5 ? 1 : -1,
      type: 'moving'
    });
  }
}

function showStartScreen() {
  background(0);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(48);
  text("A FENDA DE BRITO", width / 2, height / 2 - 50);
  textSize(20);
  text("PRESSIONE ENTER PARA COMEÇAR", width / 2, height / 2 + 30);
}

function keyPressed() {
  if (!gameStarted && keyCode === ENTER) {
    gameStarted = true;
  }
}

function createWall(x, y, w, h) {
  return { x, y, w, h, type: 'static' };
}

function collidesWithWall(subPos, wall) {
  let subLeft = subPos.x - 25;
  let subRight = subPos.x + 25;
  let subTop = subPos.y - 15;
  let subBottom = subPos.y + 15;

  let wallLeft = wall.x;
  let wallRight = wall.x + wall.w;
  let wallTop = wall.y;
  let wallBottom = wall.y + wall.h;

  return !(subRight < wallLeft || subLeft > wallRight || subBottom < wallTop || subTop > wallBottom);
}

function resetSub() {
  subPos = createVector(width / 2, 0);
  deathCount++;
  resetMovingObstacles();
}

function resetMovingObstacles() {
  for (let i = 0; i < obstacles.length; i++) {
    if (obstacles[i].type === 'moving') {
      obstacles[i].pos.x = random(100, width - 100);
      obstacles[i].pos.y = random(100, height - 200);
      obstacles[i].size = random(15, 25);
      obstacles[i].speed = random(3, 7);
      obstacles[i].direction = random() > 0.5 ? 1 : -1;
    }
  }
}