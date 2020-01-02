import {TAU, gl, logIf, width, height, random, deviate} from './util.js';
import {Matrix} from './matrix.js';

const surfaceWidth = 400;
const surfaceHeight = 400;

let program = null;
let cameraTransformLocation = null;
let surfaceTransformLocation = null;

export class Surface {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.width = surfaceWidth;
    this.canvas.height = surfaceHeight;

    this.context = this.canvas.getContext('2d');

    this.texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    this.transform = new Matrix();
    this.transform.scale(this.canvas.width, this.canvas.height, 1);
    this.transform.rotateY(random(TAU));

    this.position = [deviate(1000), deviate(100), -100-random(1000)];

    this.uploadTexture();
  }

  static setCameraTransform(transform) {
    gl.uniformMatrix4fv(cameraTransformLocation, true, transform.array);
  }

  uploadTexture() {
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.ALPHA, gl.ALPHA, gl.UNSIGNED_BYTE, this.canvas);
  }

  draw() {
    gl.useProgram(program);
    gl.bindTexture(gl.TEXTURE_2D, this.texture);

    const transform = Matrix.getTemp();
    transform.assign(this.transform);
    transform.translate(this.position[0], this.position[1], this.position[2]);
    gl.uniformMatrix4fv(surfaceTransformLocation, true, transform.array);
    Matrix.releaseTemp(1);

    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
  }
}

function init() {
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

  uniform sampler2D sampler;

  in vec2 fragPos;
  in vec3 fragCol;

  out vec4 col;

  void main() {
    col = texture(sampler, fragPos) + vec4(0, 0, 0, 0.5);
    // col = vec4(0, 0, 0, 1);
  }
  `);
  gl.compileShader(fragmentShader);
  logIf(gl.getShaderInfoLog(fragmentShader));

  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  logIf(gl.getProgramInfoLog(program))
  gl.useProgram(program);

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

init();