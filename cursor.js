import {width, height} from './util.js';

let listeners = [];

export class Cursor {
  static x = width / 2;
  static y = height / 2;
  static isDown = false;


  static addListener(listener) {
    listeners.push(listener);
  }

  static onDown(event) {
    Cursor.isDown = true;
    Cursor.x = event.clientX;
    Cursor.y = event.clientY;
    for (const listener of listeners) {
      listener.onCursorDown();
    }
  }

  static onUp(event) {
    Cursor.isDown = false;
    Cursor.x = event.clientX;
    Cursor.y = event.clientY;
    for (const listener of listeners) {
      listener.onCursorUp();
    }
  }

  static onMove(event) {
    Cursor.x = event.clientX;
    Cursor.y = event.clientY;
    for (const listener of listeners) {
      listener.onCursorMove();
    }
  }
}
