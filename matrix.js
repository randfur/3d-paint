const identityArray = new Float32Array([
  1, 0, 0, 0,
  0, 1, 0, 0,
  0, 0, 1, 0,
  0, 0, 0, 1,
]);

export class Matrix {
  static identity = new Matrix();

  static temps = [];
  static nextTemp = 0;

  static getTemp() {
    if (Matrix.nextTemp > 100) {
      throw 'too many temps';
    }
    while (Matrix.nextTemp >= Matrix.temps.length) {
      Matrix.temps.push(new Matrix());
    }
    return Matrix.temps[Matrix.nextTemp++];
  }

  static releaseTemp(n) {
    Matrix.nextTemp -= n;
  }

  constructor(array = identityArray) {
    this.array = new Float32Array(array);
  }

  reset() {
    this.assign(Matrix.identity);
  }

  assign(matrix) {
    this.array.set(matrix.array);
  }

  get(row, col) {
    return this.array[row * 4 + col];
  }

  set(row, col, value) {
    this.array[row * 4 + col] = value;
  }

  toString() {
    let result = '';
    for (let row = 0; row < 4; ++row) {
      for (let col = 0; col < 4; ++col) {
        result += this.get(row, col) + ' ';
      }
      result += '\n';
    }
    return result;
  }

  transpose() {
    const original = Matrix.getTemp();
    original.assign(this);
    for (let row = 0; row < 4; ++row) {
      for (let col = 0; col < 4; ++col) {
        this.set(row, col, original.get(col, row));
      }
    }
    Matrix.releaseTemp(1);
  }

  multiplyLeft(left) {
    const right = Matrix.getTemp();
    right.assign(this);
    for (let row = 0; row < 4; ++row) {
      for (let col = 0; col < 4; ++col) {
        let sum = 0;
        for (let i = 0; i < 4; ++i) {
          sum += left.get(row, i) * right.get(i, col);
        }
        this.set(row, col, sum);
      }
    }
    Matrix.releaseTemp(1);
  }

  multiplyVectorRight(vector) {
    let x = 0;
    let y = 0;
    let z = 0;
    for (let i = 0; i < 3; ++i) {
      x += this.get(0, i) * vector.array[i];
      y += this.get(1, i) * vector.array[i];
      z += this.get(2, i) * vector.array[i];
    }
    vector.x = x + this.get(0, 3);
    vector.y = y + this.get(1, 3);
    vector.z = z + this.get(2, 3);
  }

  translate(x, y, z) {
    this.array[0 * 4 + 3] += x;
    this.array[1 * 4 + 3] += y;
    this.array[2 * 4 + 3] += z;
  }

  scale(x, y, z) {
    this.array[0 * 4 + 0] *= x;
    this.array[1 * 4 + 1] *= y;
    this.array[2 * 4 + 2] *= z;
  }

  rotateZ(angle) {
    // (x + iy) * (c + is)
    // xc - ys + i(xs + yc)
    // x' = x*cos - y*sin
    // y' = x*sin + y*cos
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const rotate = Matrix.getTemp();
    rotate.reset();
    rotate.set(0, 0, cos);
    rotate.set(0, 1, -sin);
    rotate.set(1, 0, sin);
    rotate.set(1, 1, cos);
    this.multiplyLeft(rotate);
    Matrix.releaseTemp(1);
  }

  rotateX(angle) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const rotate = Matrix.getTemp();
    rotate.reset();
    rotate.set(1, 1, cos);
    rotate.set(1, 2, -sin);
    rotate.set(2, 1, sin);
    rotate.set(2, 2, cos);
    this.multiplyLeft(rotate);
    Matrix.releaseTemp(1);
  }

  rotateY(angle) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const rotate = Matrix.getTemp();
    rotate.reset();
    rotate.set(2, 2, cos);
    rotate.set(2, 0, -sin);
    rotate.set(0, 2, sin);
    rotate.set(0, 0, cos);
    this.multiplyLeft(rotate);
    Matrix.releaseTemp(1);
  }

  frustum(zNear, zFar, zViewportRatio) {
    const sideLength = zNear * zViewportRatio;
    const perspective = zFar / zNear;
    const zLength = zFar - zNear;

    const temp = Matrix.getTemp();
    temp.reset();
    temp.set(0, 0, 2 / sideLength)
    temp.set(1, 1, 2 / sideLength)
    // [z, 1] -> [z', w']
    // [-n, 1] -> [1, 1]
    // [-f, 1] -> [-p, p]
    // [[a, b], [c, d]] * [[z], [1]]
    // -an + b = 1
    // -af + b = -p
    // af - an = 1 + p
    // a = (1 + p) / (f - n)
    // b = 1 + n * (1 + p) / (f - n)
    //
    // -cn + d = 1
    // -cf + d = p
    // cf - cn = 1 - p
    // c = (1 - p) / (f - n)
    // d = 1 + n * (1 - p) / (f - n)
    temp.set(2, 2, (1 + perspective) / zLength);
    temp.set(2, 3, 1 + zNear * (1 + perspective) / zLength);
    temp.set(3, 2, (1 - perspective) / zLength);
    temp.set(3, 3, 1 + zNear * (1 - perspective) / zLength);
    this.multiplyLeft(temp);
    Matrix.releaseTemp(1);

  }
}