import {logIf, TAU, width, height} from './util.js';
import {Cursor} from './cursor.js';
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

  static updateTransform() {
    Camera.transform.reset();
    Camera.transform.translate(
      -Camera.position.x,
      -Camera.position.y,
      -Camera.position.z,
    );

    Camera.transform.rotateY(-Camera.angleY);
    Camera.transform.rotateX(-Camera.angleX);

    Camera.transform.frustum(Camera.zNear, Camera.zFar, Camera.zViewportRatio);
    if (width > height) {
      Camera.transform.scale(height / width, 1, 1);
    } else {
      Camera.transform.scale(1, width / height, 1);
    }
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
      listener.onCursorRayDown(Camera.position, rayDirection);
    }
    Vector.releaseTemp(1);
  }

  static onCursorMove() {
    const rayDirection = Vector.getTemp();
    Camera.getCursorDirection(rayDirection);
    for (const listener of listeners) {
      listener.onCursorRayMove(Camera.position, rayDirection);
    }
    Vector.releaseTemp(1);
  }

  static onCursorUp() {}
}
