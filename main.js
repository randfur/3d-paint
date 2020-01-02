import {TAU, width, height, gl} from './util.js';
import {mouseDown, mouseX, mouseY} from './mouse.js';
import {Surface} from './surface.js';
import {Matrix} from './matrix.js';
import {Camera} from './camera.js';

let camera = null;
let surfaces = null;


function debuggingInit() {
  window.addEventListener('error', event => {
    window.output.textContent = event.error.stack;
  });
}

function debuggingDone() {
  Object.assign(window, {
    gl,
    Matrix,
    camera,
    surfaces,
  });
  console.log('all good');
}

window.addEventListener('mousemove', event => {
  if (mouseDown) {
    paint(mouseX, mouseY);
  }
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

  Surface.setCameraTransform(camera.transform);

  for (const surface of surfaces) {
    surface.draw();
  }
}

function main() {
  debuggingInit();

  camera = new Camera();
  camera.position.set(0, 200, 300);
  camera.angleX = TAU * 0.05;
  camera.updateTransform();

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

  debuggingDone();
}
main();