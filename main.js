import {TAU, width, height, gl, range} from './util.js';
import {Cursor} from './cursor.js';
import {Keys} from './keys.js';
import {Frames} from './frames.js';
import {Surface} from './surface.js';
import {Matrix} from './matrix.js';
import {Vector} from './vector.js';
import {Camera} from './camera.js';
import {Debug} from './debug.js';

function init() {
  Frames.init();

  Camera.position.set(0, 100, 300);
  Camera.angleY = TAU * 0.05;
  Camera.angleX = -TAU * 0.05;
  Camera.updateTransform();

  Surface.init();
  Surface.all = range(10).map(_ => new Surface());
}

function registerEvents() {
  window.addEventListener('keydown', Keys.onDown);
  window.addEventListener('keyup', Keys.onUp);

  window.addEventListener('mousedown', Cursor.onDown);
  window.addEventListener('mouseup', Cursor.onUp);
  window.addEventListener('mousemove', Cursor.onMove);

  Cursor.addListener(Camera);

  Camera.addListener(Surface);

  Frames.addListener(Camera);
  Frames.addListener({
    onRedraw: draw,
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
    Vector,
    Matrix,
    Camera,
    Surface,
  });
}

main();
