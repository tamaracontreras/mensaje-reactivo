let letras = [
  "El cambio empieza cuando te animas a mover A mudança começa quando você se atreve a mexer Change begins when you dare to move El cambio comienza cuando te atreves a moverte 変化は、動く勇気を持ったときに始まる"]



let letraEspacio = 60;
let particles = [];
let currentIndex = 0;
let mensajeEspacio = "¿Caos? Pulsa espacio y todo volverá a su lugar ✨"

function setup() {
  createCanvas(windowWidth, windowHeight);
  textSize(88);
  textAlign(CENTER, CENTER);
  crearParticulas(letras[currentIndex]);
}

function draw() {
  background(17);

  for (let p of particles) {
    p.applyMouseRepel();
    p.move();
    p.display();
    p.shrink();
  }
   // Mostrar mensaje en blanco
  fill(255);
  textSize(24); // Puedes ajustar el tamaño
  textAlign(CENTER, BOTTOM);
  text(mensajeEspacio, width / 2, height - 40); // Posición inferior centrada
}



function crearParticulas(frase) {
  particles = [];
  let renglonMax = 20; // letras por línea
  let filas = ceil(frase.length / renglonMax);
  let totalAltura = filas * letraEspacio;
  let startY = (height / 2) - (totalAltura / 2);

  for (let i = 0; i < frase.length; i++) {
    let col = i % renglonMax;
    let fila = floor(i / renglonMax);

    let letra = frase[i];
    let x = (width / 2 - (renglonMax * letraEspacio / 2)) + col * letraEspacio;
    let y = startY + fila * letraEspacio;

    if (letra !== " ") {
      particles.push(new LetraParticle(x, y, letra));
    }
  }
}

class LetraParticle {
 constructor(x, y, letra) {
  this.x = x;
  this.y = y;
  this.homeX = x; // ⬅ posición original
  this.homeY = y;
  this.dx = 0;
  this.dy = 0;
  this.letra = letra;
  this.baseSize = 68;
  this.size = this.baseSize;
  this.col = color(random(200,255), random(100,150), random(200,255));
  this.hasBeenPushed = false;
  this.returning = false; // ⬅ ¿está volviendo?
}
returnToHome() {
  this.returning = true;
}


  move() {
  if (this.returning) {
    this.dx = (this.homeX - this.x) * 0.05;
    this.dy = (this.homeY - this.y) * 0.05;

    if (dist(this.x, this.y, this.homeX, this.homeY) < 1) {
      this.x = this.homeX;
      this.y = this.homeY;
      this.dx = 0;
      this.dy = 0;
      this.returning = false;
      this.hasBeenPushed = false;
    }
  }

  this.x += this.dx;
  this.y += this.dy;

  if (this.x < 0 || this.x > width) this.dx *= -1;
  if (this.y < 0 || this.y > height) this.dy *= -1;
}


  display() {
    fill(this.col);
    textSize(this.size);
    text(this.letra, this.x, this.y);
  }

  applyMouseRepel() {
    let d = dist(this.x, this.y, mouseX, mouseY);
    let repelRadius = 80;

    if (d < repelRadius) {
      let angle = atan2(this.y - mouseY, this.x - mouseX);
      let force = map(d, 0, repelRadius, 5, 0);

      if (!this.hasBeenPushed) {
        this.dx = random(-3, 3);
        this.dy = random(-3, 3);
        this.hasBeenPushed = true;
      }

      this.dx += cos(angle) * force * 0.1;
      this.dy += sin(angle) * force * 0.1;

      this.dx = constrain(this.dx, -5, 5);
      this.dy = constrain(this.dy, -5, 5);

      this.size += 70;
      this.size = constrain(this.size, this.baseSize, 80);
    }
  }

  shrink() {
    if (this.size > this.baseSize) {
      this.size -= 1;
      this.size = max(this.size, this.baseSize);
    }
  }
}
function keyPressed() {
  if (key === ' ') {
    for (let p of particles) {
      p.returnToHome();
    }
  }
}
