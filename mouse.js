import {width, height} from './util.js';

export let mouseX = width / 2;
export let mouseY = height / 2;
export let mouseDown = false;

window.addEventListener('mousedown', event => {
  mouseDown = true;
  mouseX = event.clientX;
  mouseY = event.clientY;
});

window.addEventListener('mouseup', event => {
  mouseDown = false;
  mouseX = event.clientX;
  mouseY = event.clientY;
});

window.addEventListener('mousemove', event => {
  mouseX = event.clientX;
  mouseY = event.clientY;
});
