import {Cursor} from './Cursor.js';
import {Frames} from './Frames.js';
import {Keys} from './Keys.js';
import {logIf, TAU, width, height} from './utils.js';
import {Matrix} from './Matrix.js';
import {Vector} from './Vector.js';

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

  static updateCursorRayDirection() {
    const minScreenSide = Math.min(width, height);
    Camera.cursorRayDirection.set(
        Camera.zViewportRatio * (Cursor.x - width / 2) / minScreenSide,
        Camera.zViewportRatio * (height / 2 - Cursor.y) / minScreenSide,
        -1);
    Camera.cursorRayDirection.rotateX(Camera.angleX);
    Camera.cursorRayDirection.rotateY(Camera.angleY);
  }

  static [Cursor.onDown]() {
    Camera.updateCursorRayDirection();
  }

  static [Cursor.onDrag]() {
    Camera.updateCursorRayDirection();
  }

  static [Cursor.onMove]() {
    Camera.updateCursorRayDirection();
  }
}
