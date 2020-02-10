import {Camera} from './Camera.js';
import {ControlDraw} from './ControlDraw.js';
import {Controls} from './Controls.js';
import {Cursor} from './Cursor.js';
import {Debug} from './Debug.js';
import {Frames} from './Frames.js';
import {Keys} from './Keys.js';
import {Matrix} from './Matrix.js';
import {Surface} from './Surface.js';
import {TAU, width, height, gl, range, canvas} from './utils.js';
import {Vector} from './Vector.js';

function init() {
  Frames.init(draw);

  Camera.position.set(0, 100, 300);
  // Camera.angleY = TAU * 0.05;
  Camera.angleX = -TAU * 0.05;
  Camera.updateTransform();

  Surface.init();
  Surface.all = range(20).map(_ => new Surface());
}

function registerEvents() {
  canvas.addEventListener('contextmenu', event => event.preventDefault());

  window.addEventListener('keydown', Keys.onDownEvent);
  window.addEventListener('keyup', Keys.onUpEvent);

  window.addEventListener('mousedown', Cursor.onDownEvent);
  window.addEventListener('mouseup', Cursor.onUpEvent);
  window.addEventListener('mousemove', Cursor.onMoveEvent);

  Controls.add(ControlDraw);

  Cursor.addListener(Camera);
  Cursor.addListener(Controls);

  Frames.addListener(Controls);
}

function draw() {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  Surface.draw();
}

function main() {
  Debug.init();

  init();
  registerEvents();

  Debug.done({
    gl,
    Vector,
    Matrix,
    Camera,
    Surface,
  });
}

main();
