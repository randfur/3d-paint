import {TAU} from './utils.js';
import {Camera} from './Camera.js';
import {Cursor} from './Cursor.js';
import {Keys} from './Keys.js';
import {Frames} from './Frames.js';
import {Controls} from './Controls.js';

let startAngleX = null;
let startAngleY = null;

export class ControlCamera {
  static [Controls.handleCursorDown](button) {
    if (button == Cursor.right) {
      startAngleX = Camera.angleX;
      startAngleY = Camera.angleY;
      return Controls.consume;
    }
  }

  static [Controls.handleCursorDrag]() {
    const pixelsPerRotation = 1000;
    const scale = TAU / pixelsPerRotation;
    Camera.angleX = startAngleX - Cursor.dragY * scale;
    Camera.angleY = startAngleY - Cursor.dragX * scale;
  }

  static [Controls.handleFrame](delta, time) {
    // Camera.angleY = -(Cursor.x - width / 2) / width / 2 * TAU;
    // Camera.angleX = -(Cursor.y - height / 2) / height / 2 * TAU;
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
