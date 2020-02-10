export const TAU = Math.PI * 2;
export const width = window.innerWidth;
export const height = window.innerHeight;

export const canvas = document.getElementById('canvas');
canvas.width = width;
canvas.height = height;
export const gl = canvas.getContext('webgl2');

export function assert(condition, message) {
  if (!condition) {
    throw (message ?? 'Assertion failed');
  }
}

export function logIf(text) {
  if (text != '') {
    console.log(text);
    output.textContent += text + '\n';
  }
}

export function random(x) {
  return Math.random() * x;
}

export function deviate(x) {
  return (Math.random() * 2 - 1) * x;
}

export function range(n) {
  const result = [];
  for (let i = 0; i < n; ++i) {
    result.push(i);
  }
  return result;
}
