import {logIf, TAU, width, height, maybeCall} from './util.js';
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
  static orientation = new Matrix();
  static forward = new Vector();
  static right = new Vector();
  static up = new Vector();

  static updateTransform() {
    Camera.orientation.reset();
    Camera.orientation.rotateX(Camera.angleX);
    Camera.orientation.rotateY(Camera.angleY);

    Camera.forward.set(0, 0, -1);
    Camera.right.set(1, 0, 0);
    Camera.up.set(0, 1, 0);
    Camera.orientation.multiplyVectorRight(Camera.forward);
    Camera.orientation.multiplyVectorRight(Camera.right);
    Camera.orientation.multiplyVectorRight(Camera.up);

    Camera.transform.reset();
    Camera.transform.translate(
      -Camera.position.x,
      -Camera.position.y,
      -Camera.position.z,
    );

    Camera.transform.rotateY(-Camera.angleY);
    Camera.transform.rotateX(-Camera.angleX);

    Camera.transform.frustum(Camera.zNear, Camera.zFar, Camera.zViewportRatio, width / height);
  }

  static addListener(listener) {
    listeners.push(listener);
  }

  static getCursorDirection(outVector) {
    const minScreenSide = Math.min(width, height);
    outVector.set(
        Camera.zViewportRatio * (Cursor.x - width / 2) / minScreenSide,
        Camera.zViewportRatio * (height / 2 - Cursor.y) / minScreenSide,
        -1);
    outVector.rotateX(Camera.angleX);
    outVector.rotateY(Camera.angleY);
  }

  static onCursorDown() {
    const rayDirection = Vector.getTemp();
    Camera.getCursorDirection(rayDirection);
    for (const listener of listeners) {
      maybeCall(listener.onCursorRayDown, Camera.position, rayDirection);
    }
    Vector.releaseTemp(1);
  }

  static onCursorMove() {
    const rayDirection = Vector.getTemp();
    Camera.getCursorDirection(rayDirection);
    for (const listener of listeners) {
      maybeCall(listener.onCursorRayMove, Camera.position, rayDirection);
    }
    Vector.releaseTemp(1);
  }

  static onFrame(delta, time) {
    Camera.angleY = -(Cursor.x - width / 2) / width / 2 * TAU;
    Camera.angleX = -(Cursor.y - height / 2) / height / 2 * TAU;
    const moveSpeed = 10;
    if (Keys.isDown[',']) {
      Camera.position.sumWith(1, Camera.forward, moveSpeed);
    }
    if (Keys.isDown['o']) {
      Camera.position.sumWith(1, Camera.forward, -moveSpeed);
    }
    if (Keys.isDown['a']) {
      Camera.position.sumWith(1, Camera.right, -moveSpeed);
    }
    if (Keys.isDown['e']) {
      Camera.position.sumWith(1, Camera.right, moveSpeed);
    }
    if (Keys.isDown[' ']) {
      Camera.position.sumWith(1, Camera.up, moveSpeed);
    }
    if (Keys.isDown['Shift']) {
      Camera.position.sumWith(1, Camera.up, -moveSpeed);
    }
    Camera.updateTransform();
    Frames.scheduleRedraw();
  }
}
