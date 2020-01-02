import {TAU, width, height, gl} from './util.js';
import {Surface} from './surface.js';
import {Matrix} from './matrix.js';

let camera = null;
let surfaces = null;
let mouseX = 0;
let mouseY = 0;

window.addEventListener('error', event => {
  window.output.textContent = event.error.stack;
});

let mouseDown = false;
window.addEventListener('mousedown', event => {
  mouseDown = true;
  paint(event.clientX, event.clientY);
});
window.addEventListener('mouseup', () => {
  mouseDown = false;
});
window.addEventListener('mousemove', event => {
  if (!mouseDown) {
    return;
  }
  mouseX = event.clientX;
  mouseY = event.clientY;
  paint(mouseX, mouseY);
});

function paint(x, y) {
  // x = x * 2 / width - 1;
  // y = 1 - y * 2 / height;
  y = height - y;
  const surface = surfaces[0];
  surface.context.fillStyle = 'black';
  surface.context.fillRect(Math.round(x), Math.round(y), 10, 10);
  surface.uploadTexture();
  draw();
}

function draw() {
  gl.clear(gl.COLOR_BUFFER_BIT);

  camera.reset();
  camera.translate(width / 2 - mouseX, -300, 1000 - mouseY * 10);
  // camera.rotateX(TAU * 0.05);
  camera.frustrum(1, 10000, 0.5);
  camera.scale(height / width, 1, 1);
  Surface.setCameraTransform(camera);

  for (const surface of surfaces) {
    surface.draw();
  }
}

function main() {
  camera = new Matrix();
  surfaces = [
    new Surface(),
    new Surface(),
    new Surface(),
    new Surface(),
    new Surface(),
    new Surface(),
    new Surface(),
    new Surface(),
    new Surface(),
    new Surface(),
    new Surface(),
  ];

  draw();

  Object.assign(window, {
    Matrix,
    camera,
    gl,
    surfaces,
  });
  console.log('all good');
}
main();