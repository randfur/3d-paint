import {logIf, TAU, width, height} from './util.js';
import {Matrix} from './matrix.js';
import {Vector} from './vector.js';

export class Camera {
  constructor() {
    this.position = new Vector();
    this.angleX = 0;
    this.angleY = 0;

    this.zNear = 1;
    this.zFar = 10000;
    this.zViewportRatio = 2;

    this.transform = new Matrix();
    this.updateTransform();
    logIf(this.transform)
  }

  updateTransform() {
    this.transform.reset();
    this.transform.translate(
      -this.position.x,
      -this.position.y,
      -this.position.z,
    );

    this.transform.rotateY(this.angleY);
    this.transform.rotateX(this.angleX);

    this.transform.frustum(this.zNear, this.zFar, this.zViewportRatio);
    if (width > height) {
      this.transform.scale(height / width, 1, 1);
    } else {
      this.transform.scale(1, width / height, 1);
    }
  }

  getMouseDirection(outVector) {

  }
}
