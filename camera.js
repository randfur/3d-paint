import {logIf, TAU, width, height} from './util.js';
import {Cursor} from './cursor.js';
import {Keys} from './keys.js';
import {Frames} from './frames.js';
import {Matrix} from './matrix.js';
import {Vector} from './vector.js';

let listeners = [];

export class Camera {
  static position = new Vector();
  static angleX = 0;
  static angleY = 0;

  static zNear = 1;
  static zFar = 10000;
  static zViewportRatio = 2;

  static transform = new Matrix();
  static eyeDirection = new Vector();

  static orientation = new Matrix();
  static forward = new Vector();
  static right = new Vector();
  static up = new Vector();

  static cursorRayDirection = new Vector();

  static updateTransform() {
    Camera.transform.reset();
    Camera.transform.translate(
      -Camera.position.x,
      -Camera.position.y,
      -Camera.position.z,
    );

    Camera.transform.rotateY(-Camera.angleY);
    Camera.transform.rotateX(-Camera.angleX);

    Camera.transform.frustum(Camera.zNear, Camera.zFar, Camera.zViewportRatio, width / height);

    Camera.eyeDirection.set(0, 0, -1);
    Camera.eyeDirection.rotateX(Camera.angleX);
    Camera.eyeDirection.rotateY(Camera.angleY);

    Camera.orientation.reset();
    Camera.orientation.rotateY(Camera.angleY);

    Camera.forward.set(0, 0, -1);
    Camera.right.set(1, 0, 0);
    Camera.up.set(0, 1, 0);
    Camera.orientation.multiplyVectorRight(Camera.forward);
    Camera.orientation.multiplyVectorRight(Camera.right);
    Camera.orientation.multiplyVectorRight(Camera.up);
  }

  static addListener(listener) {
    listeners.push(listener);
  }

  static updateCursorRayDirection() {
    const minScreenSide = Math.min(width, height);
    Camera.cursorRayDirection.set(
        Camera.zViewportRatio * (Cursor.x - width / 2) / minScreenSide,
        Camera.zViewportRatio * (height / 2 - Cursor.y) / minScreenSide,
        -1);
    Camera.cursorRayDirection.rotateX(Camera.angleX);
    Camera.cursorRayDirection.rotateY(Camera.angleY);
  }

  static onCursorDown() {
    Camera.updateCursorRayDirection();
    for (const listener of listeners) {
      listener.onCursorRayDown?.(Camera.position, Camera.cursorRayDirection);
    }
  }

  static onCursorMove() {
    Camera.updateCursorRayDirection();
    for (const listener of listeners) {
      listener.onCursorRayMove?.(Camera.position, Camera.cursorRayDirection);
    }
  }

  static onFrame(delta, time) {
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
      if (Keys.isDown['Shift']) {
        Camera.position.sumWith(1, Camera.up, -moveSpeed);
      } else {
        Camera.position.sumWith(1, Camera.up, moveSpeed);
      }
    }
    Camera.updateTransform();
    Frames.scheduleRedraw();
  }
}
