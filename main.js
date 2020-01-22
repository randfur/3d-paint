import {TAU, width, height, gl, range} from './util.js';
import {Cursor} from './cursor.js';
import {Surface} from './surface.js';
import {Matrix} from './matrix.js';
import {Vector} from './vector.js';
import {Camera} from './camera.js';
import {Debug} from './debug.js';

function init() {
  Camera.position.set(0, 0, 300);
  Camera.angleX = -TAU * 0.01;
  Camera.updateTransform();

  Surface.init();
  Surface.all = range(10).map(_ => new Surface());
}

function registerEvents() {
  window.addEventListener('mousedown', Cursor.onDown);
  window.addEventListener('mouseup', Cursor.onUp);
  window.addEventListener('mousemove', Cursor.onMove);

  Cursor.addListener(Camera);
  Camera.addListener(Surface);
  Surface.addListener({
    onRedrawRequired: draw,
  });
}

function draw() {
  gl.clear(gl.COLOR_BUFFER_BIT);

  Surface.draw(Camera.transform);
}

function main() {
  Debug.init();

  init();
  registerEvents();
  draw();

  Debug.done({
    gl,
    Matrix,
    Camera,
    Surface,
  });
}

main();
