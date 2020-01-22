import {TAU, gl, logIf, width, height, random, deviate} from './util.js';
import {Vector} from './vector.js';
import {Cursor} from './cursor.js';
import {Matrix} from './matrix.js';

const surfaceWidth = 400;
const surfaceHeight = 400;

let program = null;
let colourLocation = null;
let cameraTransformLocation = null;
let surfaceTransformLocation = null;

let listeners = [];

let selected = null;

export class Surface {
  static all = [];

  static init() {
    program = gl.createProgram();

    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, `#version 300 es
    precision mediump float;

    uniform mat4 cameraTransform;
    uniform mat4 surfaceTransform;

    in vec2 pos;

    out vec2 fragPos;

    void main() {
      gl_Position = cameraTransform * surfaceTransform * vec4(pos, 0, 1);
      fragPos = pos + vec2(0.5, 0.5);
    }
    `);
    gl.compileShader(vertexShader);
    logIf(gl.getShaderInfoLog(vertexShader));
    gl.attachShader(program, vertexShader);

    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, `#version 300 es
    precision mediump float;

    uniform vec3 colour;
    uniform sampler2D sampler;

    in vec2 fragPos;

    out vec4 col;

    void main() {
      col = texture(sampler, fragPos).a * vec4(colour, 1) + vec4(0, 0, 0, 0.25);
      // col = vec4(0, 0, 0, 1);
    }
    `);
    gl.compileShader(fragmentShader);
    logIf(gl.getShaderInfoLog(fragmentShader));

    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    logIf(gl.getProgramInfoLog(program))
    gl.useProgram(program);

    colourLocation = gl.getUniformLocation(program, 'colour');
    cameraTransformLocation = gl.getUniformLocation(program, 'cameraTransform');
    gl.uniformMatrix4fv(cameraTransformLocation, false, Matrix.identity.array);
    surfaceTransformLocation = gl.getUniformLocation(program, 'surfaceTransform');
    gl.uniformMatrix4fv(surfaceTransformLocation, false, Matrix.identity.array);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      0.5, 0.5,
      -0.5, 0.5,
      -0.5, -0.5,
      0.5, -0.5,
    ]), gl.STATIC_DRAW);

    const posAttribute = gl.getAttribLocation(program, 'pos');
    gl.enableVertexAttribArray(posAttribute);
    gl.vertexAttribPointer(posAttribute, 2, gl.FLOAT, gl.FALSE, 4 * 2, 0);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  }

  static addListener(listener) {
    listeners.push(listener);
  }

  static onCursorRayDown(rayPosition, rayDirection) {
    const canvasPosition = Vector.getTemp();
    let smallestT = Infinity;
    selected = null;
    for (const surface of Surface.all) {
      const t = surface.hitTest(rayPosition, rayDirection, canvasPosition);
      if (t !== null && t < smallestT) {
        selected = surface;
        smallestT = t;
      }
    }
    Vector.releaseTemp(1);
  }

  static onCursorRayMove(rayPosition, rayDirection) {
    if (!Cursor.isDown || !selected) {
      return;
    }
    const canvasPosition = Vector.getTemp();
    if (selected.hitTest(rayPosition, rayDirection, canvasPosition) !== null) {
      selected.context.fillRect(
          Math.round(canvasPosition.x) - 5,
          Math.round(canvasPosition.y) - 5,
          10, 10);
      selected.uploadTexture();
      for (const listener of listeners) {
        listener.onRedrawRequired();
      }
    }
    Vector.releaseTemp(1);
  }

  static draw(cameraTransform) {
    gl.uniformMatrix4fv(cameraTransformLocation, true, cameraTransform.array);
    for (const surface of Surface.all) {
      surface.draw();
    }
  }

  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.width = surfaceWidth;
    this.canvas.height = surfaceHeight;

    this.context = this.canvas.getContext('2d');

    this.colour = new Float32Array([random(1), random(1), random(1)]);

    this.texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    this.transform = new Matrix();
    this.transform.scale(this.canvas.width, this.canvas.height, 1);
    this.transform.rotateY(random(TAU));
    this.xAxis = new Vector(1, 0, 0);
    this.yAxis = new Vector(0, 1, 0);
    this.zAxis = new Vector(0, 0, 1);
    this.transformUpdated();

    this.position = new Vector(deviate(1000), deviate(100), -100-random(1000));

    this.uploadTexture();
  }

  transformUpdated() {
    this.xAxis.set(1, 0, 0);
    this.transform.multiplyVectorRight(this.xAxis);
    this.xAxis.normalise();

    this.yAxis.set(0, 1, 0);
    this.transform.multiplyVectorRight(this.yAxis);
    this.yAxis.normalise();

    this.zAxis.set(0, 0, 1);
    this.transform.multiplyVectorRight(this.zAxis);
    this.zAxis.normalise();
  }

  uploadTexture() {
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.ALPHA, gl.ALPHA, gl.UNSIGNED_BYTE, this.canvas);
  }

  hitTest(rayPosition, rayDirection, outCanvasPosition) {
    // ray point = P + t * D
    // surface position = S
    // surface normal = N
    // ((P + t * D) - S) . N = 0
    // P.N + t * D.N - S.N = 0
    // t = (S.N - P.N) / D.N
    const dDotN = rayDirection.dot(this.zAxis);
    if (dDotN == 0) {
      return null;
    }

    const t = (this.position.dot(this.zAxis) - rayPosition.dot(this.zAxis)) / dDotN;
    if (t <= 0) {
      return null;
    }

    const hitPosition = Vector.getTemp();
    hitPosition.assign(rayPosition);
    hitPosition.sumWith(1, rayDirection, t);
    hitPosition.sumWith(1, this.position, -1);
    const x = hitPosition.dot(this.xAxis);
    const y = hitPosition.dot(this.yAxis);
    Vector.releaseTemp(1);
    if (Math.abs(x) <= this.canvas.width / 2 && Math.abs(y) <= this.canvas.height / 2) {
      outCanvasPosition.set(x + this.canvas.width / 2, y + this.canvas.height / 2, 0);
      return t;
    }
    return null;
  }

  draw() {
    gl.useProgram(program);
    gl.bindTexture(gl.TEXTURE_2D, this.texture);

    gl.uniform3fv(colourLocation, this.colour);

    const transform = Matrix.getTemp();
    transform.assign(this.transform);
    transform.translate(this.position.x, this.position.y, this.position.z);
    gl.uniformMatrix4fv(surfaceTransformLocation, true, transform.array);
    Matrix.releaseTemp(1);

    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
  }
}
