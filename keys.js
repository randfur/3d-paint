import {maybeCall} from './util.js';

const listeners = [];

export class Keys {
  static isDown = {};

  static addListener(listener) {
    listeners.push(listener);
  }

  static onDown(event) {
    // event.preventDefault();
    Keys.isDown[event.code] = true;
    for (const listener of listeners) {
      maybeCall(listener.onKeyDown, event.code);
    }
  }

  static onUp(event) {
    // event.preventDefault();
    Keys.isDown[event.code] = false;
    for (const listener of listeners) {
      maybeCall(listener.onKeyUp, event.code);
    }
  }
}