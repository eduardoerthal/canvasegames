let bolhas = [];
let explosoes = [];
let pontos = 0;
let vidas = 3;
let jogoAtivo = true;

let congelado = false;
let congelarTempo = 0;

let bolhaTamanhoMultiplicador = 1;
let tamanhoMultiplicadorTempo = 0;

// Adicione estas variáveis para a imagem do macaco
let macacoImg;
let anguloMacaco = 0;
let mostrarMacaco = true;
let macacoTempo = 0;

function preload() {
  macacoImg = loadImage('macacotiro.png');
}

function setup() {
  createCanvas(800, 600);
  textFont('Arial', 24);
  reiniciarJogo();
}

function draw() {
  background(0, 150, 255);

  if (jogoAtivo) {
    // Atualiza congelamento
    if (congelado) {
      congelarTempo--;
      if (congelarTempo <= 0) {
        congelado = false;
      }
    }

    // Atualiza temporário de tamanho aumentado
    if (tamanhoMultiplicadorTempo > 0) {
      tamanhoMultiplicadorTempo--;
      if (tamanhoMultiplicadorTempo <= 0) {
        bolhaTamanhoMultiplicador = 1;
      }
    }


    for (let i = bolhas.length - 1; i >= 0; i--) {
      if (!congelado) bolhas[i].mover();
      bolhas[i].mostrar();

      if (bolhas[i].estourada) {
        explosoes.push(new Explosao(bolhas[i].x, bolhas[i].y, bolhas[i].r));
        // Executa efeito especial das bolhas especiais
        if (bolhas[i].tipo === 'roxa') {
          congelado = true;
          congelarTempo = 120;
        } else if (bolhas[i].tipo === 'amarela') {
          bolhaTamanhoMultiplicador = 1.5;
          tamanhoMultiplicadorTempo = 180;
        } else if (bolhas[i].tipo === 'verde') {
          vidas = min(vidas + 1, 5);
        } else if (bolhas[i].tipo === 'azul') {
          pontos += 2;
        }

        bolhas.splice(i, 1);

        // Garante pelo menos 5 bolhas normais vivas
        if (contarNormais() < 5) {
          bolhas.push(new Bolha('normal'));
        } else {
          bolhas.push(new Bolha(escolherTipoBolha()));
        }
      }
    }

    for (let i = explosoes.length - 1; i >= 0; i--) {
      explosoes[i].atualizar();
      explosoes[i].mostrar();
      if (explosoes[i].acabou()) {
        explosoes.splice(i, 1);
      }
    }

    // Mostrar pontos e vidas
    fill(255);
    textSize(24);
    text("Pontos: " + pontos, 10, 30);
    text("Vidas: " + vidas, 10, 60);

    // Mostrar macaco se estiver ativo
    if (mostrarMacaco) {
      push();
      translate(50, height - 50); // Posição no canto inferior esquerdo
      rotate(anguloMacaco);
      imageMode(CENTER);
      image(macacoImg, 0, 0, 80, 80);
      pop();
    }

  } else {
    fill(0, 100, 200);
    rect(0, 0, width, height);
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(36);
    text("Fim de Jogo!", width / 2, height / 2 - 40);
    textSize(28);
    text("Você estourou " + pontos + " bolha(s)", width / 2, height / 2);
    textSize(20);
    text("Clique para jogar novamente", width / 2, height / 2 + 60);
  }
}

function mousePressed() {
  if (!jogoAtivo) {
    reiniciarJogo();
    return;
  }

  let acertou = false;
  for (let i = 0; i < bolhas.length; i++) {
    if (bolhas[i].verificarClique(mouseX, mouseY)) {
      if (bolhas[i].tipo === 'vermelha') {
        vidas--;
        if (vidas <= 0) jogoAtivo = false;
      } else {
        bolhas[i].estourar();
        if (bolhas[i].tipo === 'azul') {
          pontos += 2;
        } else if (bolhas[i].tipo === 'normal') {
          pontos++;
        }
        
        // Ativa o macaco quando uma bolha é estourada
        mostrarMacaco = true;
        macacoTempo = 30; // Mostra por 0.5 segundos (60 fps)
        // Calcula o ângulo entre o macaco e o mouse
        let macacoX = 50; // Posição X do macaco
        let macacoY = height - 50; // Posição Y do macaco
        anguloMacaco = atan2(mouseY - macacoY, mouseX - macacoX);
      }
      acertou = true;
      break;
    }
  }

  if (!acertou) {
    vidas--;
    if (vidas <= 0) jogoAtivo = false;
  }
}

function reiniciarJogo() {
  pontos = 0;
  vidas = 3;
  jogoAtivo = true;
  bolhas = [];
  explosoes = [];
  congelado = false;
  congelarTempo = 0;
  bolhaTamanhoMultiplicador = 1;
  tamanhoMultiplicadorTempo = 0;

  for (let i = 0; i < 10; i++) {
    bolhas.push(new Bolha(escolherTipoBolha()));
  }
}

// Conta quantas bolhas normais estão no array
function contarNormais() {
  let count = 0;
  for (let b of bolhas) {
    if (b.tipo === 'normal') count++;
  }
  return count;
}

// Escolhe o tipo da bolha considerando probabilidade e equilíbrio
function escolherTipoBolha() {
  // Probabilidades base para cada tipo
  let prob = random();
  if (prob < 0.15) return 'vermelha';    // 15% vermelha (erra = perde vida)
  else if (prob < 0.25) return 'azul';   // 10% azul (pontos extras)
  else if (prob < 0.30) return 'verde';  // 5% verde (vida extra)
  else if (prob < 0.35) return 'roxa';   // 5% roxa (congela)
  else if (prob < 0.40) return 'amarela';// 5% amarela (aumenta tamanho)
  else return 'normal';                   // 60% normal
}

class Bolha {
  constructor(tipo = 'normal') {
    this.x = random(width);
    this.y = random(height);


    let minR = max(10, 50 - pontos * 0.5);
    this.r = random(minR, minR + 20) * bolhaTamanhoMultiplicador;

    let velocidadeMax = 1 + pontos * 0.1;
    this.vx = random(-velocidadeMax, velocidadeMax);
    this.vy = random(-velocidadeMax, velocidadeMax);

    this.estourada = false;
    this.tipo = tipo;
  }

  mover() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0) {
      this.x = 0;
      this.vx *= -1;
    }
    if (this.x > width) {
      this.x = width;
      this.vx *= -1;
    }
    if (this.y < 0) {
      this.y = 0;
      this.vy *= -1;
    }
    if (this.y > height) {
      this.y = height;
      this.vy *= -1;
    }
  }

  mostrar() {
    noStroke();
    switch (this.tipo) {
      case 'vermelha':
        fill(255, 0, 0, 200);
        break;
      case 'azul':
        fill(0, 0, 255, 200);
        break;
      case 'verde':
        fill(0, 255, 0, 200);
        break;
      case 'roxa':
        fill(128, 0, 128, 200);
        break;
      case 'amarela':
        fill(255, 255, 0, 200);
        break;
      default:
        fill(255, 255, 255, 100);
    }
    ellipse(this.x, this.y, this.r * 2);
  }

  verificarClique(mx, my) {
    let d = dist(mx, my, this.x, this.y);
    return d < this.r;
  }

  estourar() {
    this.estourada = true;
  }
}

class Explosao {
  constructor(x, y, tamanho) {
    this.x = x;
    this.y = y;
    this.tamanho = tamanho;
    this.tempo = 20;
    this.particulas = [];
    for (let i = 0; i < 15; i++) {
      let ang = random(TWO_PI);
      let vel = random(2, 5);
      this.particulas.push({
        x: x,
        y: y,
        vx: cos(ang) * vel,
        vy: sin(ang) * vel,
        alpha: 255
      });
    }
  }

  atualizar() {
    this.tempo--;
    for (let p of this.particulas) {
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= 10;
    }
  }

  mostrar() {
    noStroke();
    for (let p of this.particulas) {
      fill(255, 255, 255, p.alpha);
      ellipse(p.x, p.y, 8);
    }
  }

  acabou() {
    return this.tempo <= 0;
  }
}
