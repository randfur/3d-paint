const originArray = new Float32Array([
  0, 0, 0, 1,
]);

export class Vector {
  static origin = new Vector();

  static temps = [];
  static nextTemp = 0;

  static getTemp() {
    while (Vector.nextTemp >= Vector.temps.length) {
      Vector.temps.push(new Vector());
    }
    return Vector.temps[Vector.nextTemp++];
  }

  static releaseTemp(n) {
    Vector.nextTemp -= n;
  }

  constructor(x=0, y=0, z=0, w=1) {
    this.array = new Float32Array([x, y, z, w]);
  }

  assign(other) {
    this.array.set(other.array);
  }

  reset() {
    this.assign(Vector.origin);
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

  set(x, y, z) {
    this.array[0] = x;
    this.array[1] = y;
    this.array[2] = z;
  }
}