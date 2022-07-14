
const LIENZO = document.getElementById('lienzo');
const CTX = LIENZO.getContext('2d');
LIENZO.width = window.innerWidth;
LIENZO.height = window.innerHeight;

let arrayParticulas = [];


// raton

let mouse = {
  x: null,
  y: null,
  radius: 100
};

window.addEventListener('mousemove', function (event) {
  mouse.x = event.x + LIENZO.clientLeft / 2;
  mouse.y = event.y + LIENZO.clientTop / 2;
});

function drawImage() {
  let imageWidth = png.width;
  let imageHeight = png.height;
  const DATA = CTX.getImageData(0, 0, imageWidth, imageHeight);
  CTX.clearRect(0, 0, imageWidth, imageHeight);

  class Particula {
    constructor(x, y, color, size) {

      this.x = x + LIENZO.width / 2 - png.width * 2,
        this.y = y + LIENZO.height / 2 - png.height * 2,
        this.color = color,
        this.size = 2,
        this.baseX = x + LIENZO.width / 2 - png.width * 2,
        this.baseY = y + LIENZO.height / 2 - png.height * 2,
        this.densidad = (Math.random() * 10) + 2;
    };

    draw() {
      CTX.beginPath();
      CTX.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      CTX.closePath();
      CTX.fill();
    };

    update() {
      CTX.fillStyle = this.color;

      // colision con el raton
      let dx = mouse.x - this.x;
      let dy = mouse.y - this.y;
      let distancia = Math.sqrt(dx * dx + dy * dy);
      let fuezaDireccionX = dx / distancia;
      let fuezaDireccionY = dy / distancia;


      // Si pasa de la distancia maxima, se convierte en 0.

      const DISTANCIA_MAX = 100;
      let fuerza = (DISTANCIA_MAX - distancia) / DISTANCIA_MAX;

      if (fuerza < 0) fuerza = 0;

      let direccionX = (fuezaDireccionX * fuerza * this.densidad * 0.6);
      let direccionY = (fuezaDireccionY * fuerza * this.densidad * 0.6);

      if (distancia < mouse.radius + this.size) {
        this.x -= direccionX;
        this.y -= direccionY;
      } else {
        if (this.x !== this.baseX) {

          let dx = this.x - this.baseX;
          this.x -= dx / 20;

        };
        if (this.y !== this.baseY) {

          let dy = this.y - this.baseY;
          this.y -= dy / 20;

        };

      };

      this.draw();

    };

  };

  function init() {
    arrayParticulas = [];

    for (let y = 0, y2 = DATA.height; y < y2; y++) {
      for (let x = 0, x2 = DATA.width; x < x2; x++) {

        if (DATA.data[(y * 4 * DATA.width) + (x * 4) + 3] > 128) {

          let posicionX = x;
          let posicionY = y;

          let color = `rgba(${DATA.data[(y * 4 * DATA.width) + (x * 4) + 0]},
                            ${DATA.data[(y * 4 * DATA.width) + (x * 4) + 1]},
                            ${DATA.data[(y * 4 * DATA.width) + (x * 4) + 2]})`;

          arrayParticulas.push(new Particula(posicionX * 4, posicionY * 4, color));
        };

      };

    };

  };

  function animate() {
    requestAnimationFrame(animate);
    CTX.fillStyle = 'rgba(0, 0, 0, 0.05)';
    CTX.fillRect(0, 0, LIENZO.width, LIENZO.height);

    for (let i = 0; i < arrayParticulas.length; i++) {
      arrayParticulas[i].update();
    }

  }
  init();
  animate();

  window.addEventListener('resize', function () {
    LIENZO.width = window.innerWidth;
    LIENZO.height = window.innerHeight;
    init();
  });


};

const png = new Image();

png.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAexAAAHsQEGxWGGAAAFyWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNy4xLWMwMDAgNzkuYTg3MzFiOSwgMjAyMS8wOS8wOS0wMDozNzozOCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIiB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIzLjAgKFdpbmRvd3MpIiB4bXA6Q3JlYXRlRGF0ZT0iMjAyMi0wNy0xNFQxNTo0MToxMCswMTowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMi0wNy0xNFQxNTo0MToxMCswMTowMCIgeG1wOk1vZGlmeURhdGU9IjIwMjItMDctMTRUMTU6NDE6MTArMDE6MDAiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OGZmY2I4MWUtZjJmZC0wYTRlLTliOTEtYTFhZjZlZWU3MTVjIiB4bXBNTTpEb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6NDNlMmZjZjEtMDg5NC0xZDRjLWExZGQt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";


window.addEventListener('load', function () {
  console.log('cargado');
  CTX.drawImage(png, 0, 0);
  drawImage();
});
