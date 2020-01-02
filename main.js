import {TAU, width, height, gl} from './util.js';
import {mouseDown, mouseX, mouseY} from './mouse.js';
import {Surface} from './surface.js';
import {Matrix} from './matrix.js';
import {Vector} from './vector.js';
import {Camera} from './camera.js';

let camera = null;
let surfaces = null;
let selectedSurface = null;

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

function registerEvents() {
  window.addEventListener('mousedown', event => {
    const mouseDirection = Vector.getTemp();
    const canvasPosition = Vector.getTemp();
    camera.getMouseDirection(mouseDirection);
    let smallestT = Infinity;
    selectedSurface = null;
    for (const surface of surfaces) {
      const t = surface.hitTest(camera.position, mouseDirection, canvasPosition);
      if (t !== null && t < smallestT) {
        selectedSurface = surface;
        smallestT = t;
      }
    }
    Vector.releaseTemp(2);
  });

  window.addEventListener('mousemove', event => {
    if (!mouseDown || !selectedSurface) {
      return;
    }
    const mouseDirection = Vector.getTemp();
    const canvasPosition = Vector.getTemp();
    camera.getMouseDirection(mouseDirection);
    if (selectedSurface.hitTest(camera.position, mouseDirection, canvasPosition) !== null) {
      selectedSurface.context.fillRect(
          Math.round(canvasPosition.x) - 5,
          Math.round(canvasPosition.y) - 5,
          10, 10);
      selectedSurface.uploadTexture();
      draw();
    }
    Vector.releaseTemp(2);
  });
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
  // camera.angleX = -TAU * 0.05;
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

  registerEvents();

  draw();

  debuggingDone();
}
main();