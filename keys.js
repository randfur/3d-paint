import {maybeCall} from './util.js';

const listeners = [];

export class Keys {
  static isDown = {};

  static addListener(listener) {
    listeners.push(listener);
  }

  static onDown({key}) {
    Keys.isDown[key] = true;
    for (const listener of listeners) {
      maybeCall(listener.onKeyDown, key);
    }
  }

  static onUp({key}) {
    Keys.isDown[key] = false;
    for (const listener of listeners) {
      maybeCall(listener.onKeyUp, key);
    }
  }
}