const originArray = new Float32Array([0, 0, 0]);

export class Vector {
  static origin = new Vector();

  static temps = [];
  static nextTemp = 0;

  static getTemp() {
    if (Vector.nextTemp > 100) {
      throw 'too many temps';
    }
    while (Vector.nextTemp >= Vector.temps.length) {
      Vector.temps.push(new Vector());
    }
    return Vector.temps[Vector.nextTemp++];
  }

  static releaseTemp(n) {
    Vector.nextTemp -= n;
  }

  constructor(x=0, y=0, z=0) {
    this.array = new Float32Array([x, y, z]);
  }

  get x() {
    return this.array[0];
  }

  set x(value) {
    this.array[0] = value;
  }

  get y() {
    return this.array[1];
  }

  set y(value) {
    this.array[1] = value;
  }

  get z() {
    return this.array[2];
  }

  set z(value) {
    this.array[2] = value;
  }

  assign(other) {
    this.array.set(other.array);
  }

  reset() {
    this.set(0, 0, 0);
  }

  set(x, y, z) {
    this.array[0] = x;
    this.array[1] = y;
    this.array[2] = z;
  }

  scale(k) {
    this.array[0] *= k;
    this.array[1] *= k;
    this.array[2] *= k;
  }

  add(x, y, z) {
    this.array[0] += x;
    this.array[1] += y;
    this.array[2] += z;
  }

  sumWith(kThis, other, kOther) {
    this.array[0] = kThis * this.array[0] + kOther * other.array[0];
    this.array[1] = kThis * this.array[1] + kOther * other.array[1];
    this.array[2] = kThis * this.array[2] + kOther * other.array[2];
  }

  dot(other) {
    return (
        this.array[0] * other.array[0] +
        this.array[1] * other.array[1] +
        this.array[2] * other.array[2]);
  }

  normalise() {
    this.scale(1 / Math.sqrt(this.dot(this)));
  }

  rotateX(angle) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    this.set(
        this.x,
        this.y * cos - this.z * sin,
        this.y * sin + this.z * cos);
  }

  rotateY(angle) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    this.set(
        this.z * sin + this.x * cos,
        this.y,
        this.z * cos - this.x * sin);
  }
}
