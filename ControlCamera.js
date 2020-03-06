import {TAU} from './utils.js';
import {Camera} from './Camera.js';
import {Cursor} from './Cursor.js';
import {Keys} from './Keys.js';
import {Frames} from './Frames.js';
import {Controls} from './Controls.js';

let startAngleX = null;
let startAngleY = null;

let targetAngleX = null;
let targetAngleY = null;

const targetAngleSmoothing = 1.2;

export class ControlCamera {
  static [Controls.handleCursorDragStart](button) {
    if (button == Cursor.right) {
      startAngleX = Camera.angleX;
      startAngleY = Camera.angleY;
      return Controls.consume;
    }
  }

  static [Controls.handleCursorDrag]() {
    const pixelsPerRotation = 1000;
    const scale = TAU / pixelsPerRotation;
    targetAngleX = startAngleX - Cursor.dragY * scale;
    targetAngleY = startAngleY - Cursor.dragX * scale;
  }

  static [Controls.handleFrame](delta, time) {
    if (targetAngleX !== null) {
      Camera.angleX += (targetAngleX - Camera.angleX) / targetAngleSmoothing;
      Camera.angleY += (targetAngleY - Camera.angleY) / targetAngleSmoothing;
    }

    const moveSpeed = 10;
    if (Keys.isDown['KeyW']) {
      Camera.position.sumWith(1, Camera.forward, moveSpeed);
    }
    if (Keys.isDown['KeyS']) {
      Camera.position.sumWith(1, Camera.forward, -moveSpeed);
    }
    if (Keys.isDown['KeyA']) {
      Camera.position.sumWith(1, Camera.right, -moveSpeed);
    }
    if (Keys.isDown['KeyD']) {
      Camera.position.sumWith(1, Camera.right, moveSpeed);
    }
    if (Keys.isDown['Space']) {
      Camera.position.sumWith(1, Camera.up, moveSpeed);
    }
    if (Keys.isDown['Shift'] || Keys.isDown['KeyX']) {
      Camera.position.sumWith(1, Camera.up, -moveSpeed);
    }
    Camera.updateTransform();
    Frames.scheduleRedraw();
  }
}
