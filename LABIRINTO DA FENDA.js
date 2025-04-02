let subPos;
let subVel;
let obstacles = [];
let wallThickness = 40;
let gif;
let gifDisplayed = false;

function setup() {
  createCanvas(600, 600);
  subPos = createVector(width / 2, 0);
  subVel = createVector(0, 0);

  obstacles.push(createWall(150, 100, 200, 20));
  obstacles.push(createWall(250, 180, 20, 300));
  obstacles.push(createWall(120, 180, 20, 300));
  obstacles.push(createWall(410, 100, 200, 20));
  obstacles.push(createWall(300, 478, 285, 200));

  for (let i = 0; i < 5; i++) {
    let x = random(100, width - 100);
    let y = random(100, height - 200);
    let size = random(15, 25);
    let speed = random(3, 7);
    obstacles.push({
      pos: createVector(x, y),
      size: size,
      speed: speed,
      direction: random() > 0.5 ? 1 : -1,
      type: 'moving'
    });
  }

  gif = createImg('https://media1.tenor.com/m/z6HrXSWAouAAAAAC/cuphead-meme.gif');
  gif.hide();
}

function draw() {
  background(0, 0, 50);

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

  fill(255, 255, 255);
  beginShape();
  vertex(400, height);
  vertex(580, height);
  vertex(550, height - 100);
  vertex(150, height - 100);
  endShape();

  fill(255, 255, 0);
  ellipse(subPos.x, subPos.y, 50, 30);

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
        subPos = createVector(width / 2, 0);
      }
    } else {
      let d = dist(subPos.x, subPos.y, obstacles[i].pos.x, obstacles[i].pos.y);
      if (d < 25 + obstacles[i].size / 2) {
        subPos = createVector(width / 2, 0);
      }
    }
  }

  if (!gifDisplayed && subPos.x > 150 && subPos.x < 580 && subPos.y > height - 120 && subPos.y < height - 80) {
    gif.show();
    gif.position(width / 2 - gif.width / 2, height / 2 - gif.height / 2);
    gifDisplayed = true;
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
