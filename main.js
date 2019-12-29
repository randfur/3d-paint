window.addEventListener('error', event => {
  window.output.textContent = event.error.stack;
});

const width = window.innerWidth;
const height = window.innerHeight;
canvas.width = width;
canvas.height = height;
const gl = canvas.getContext('webgl2');

let image = document.createElement('canvas');
image.width = width;
image.height = height;
let imageContext = image.getContext('2d');

let imageB = document.createElement('canvas');
imageB.width = width;
imageB.height = height;
let imageBContext = imageB.getContext('2d');

let mouseDown = false;
window.addEventListener('mousedown', () => {
  mouseDown = true;
});
window.addEventListener('mouseup', () => {
  mouseDown = false;
});
window.addEventListener('mousemove', event => {
  if (!mouseDown) {
    return;
  }
  const x = event.clientX;
  const y = event.clientY;
  imageContext.fillStyle = 'black';
  imageContext.fillRect(x, y, 10, 10);
  imageBContext.fillStyle = 'white';
  imageBContext.fillRect(x - 20, y - 20, 10, 10);
  draw();
});

function logIf(text) {
  if (text != '') {
    console.log(text);
    output.textContent += text + '\n';
  }
}

const program = gl.createProgram();
const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, `#version 300 es
precision mediump float;
in vec2 pos;
out vec2 fragPos;
void main() {
  gl_Position = vec4(pos, 0, pos.y + 1.5);
  fragPos = vec2(pos.x - 1.0, 1.0 - pos.y) / 2.0;
}
`);
gl.compileShader(vertexShader);
logIf(gl.getShaderInfoLog(vertexShader));
gl.attachShader(program, vertexShader);
const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, `#version 300 es
precision mediump float;
in vec2 fragPos;
uniform sampler2D textureSampler;
uniform sampler2D textureSamplerB;
out vec4 col;
void main() {
  col = texture(textureSampler, fragPos) + texture(textureSamplerB, fragPos);
}
`);
gl.compileShader(fragmentShader);
logIf(gl.getShaderInfoLog(fragmentShader));
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);
logIf(gl.getProgramInfoLog(program))
gl.useProgram(program);

const buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
  1, 1,
  -1, 1,
  -1, -1,
  -1, -1,
  1, -1,
  1, 1,
]), gl.STATIC_DRAW);

const posAttribute = gl.getAttribLocation(program, 'pos');
gl.enableVertexAttribArray(posAttribute);
gl.vertexAttribPointer(posAttribute, 2, gl.FLOAT, gl.FALSE, 4 * 2, 0);

gl.uniform1i(gl.getUniformLocation(program, 'textureSampler'), 0);
const texture = gl.createTexture();
gl.activeTexture(gl.TEXTURE0);
gl.bindTexture(gl.TEXTURE_2D, texture);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

gl.uniform1i(gl.getUniformLocation(program, 'textureSamplerB'), 1);
const textureB = gl.createTexture();
gl.activeTexture(gl.TEXTURE1);
gl.bindTexture(gl.TEXTURE_2D, textureB);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

function draw() {
  gl.activeTexture(gl.TEXTURE0);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

  gl.activeTexture(gl.TEXTURE1);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, imageB);

  gl.drawArrays(gl.TRIANGLES, 0, 6);
}
draw();

window.gl = gl;
console.log('all good');