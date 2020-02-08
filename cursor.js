import {width, height} from './util.js';

let listeners = [];

export class Cursor {
  static left = 0;
  static right = 1;
  static middle = 2;

  static x = width / 2;
  static y = height / 2;

  static isDown = {};

  static dragStartX = 0;
  static dragStartY = 0;
  static dragButton = null;

  static addListener(listener) {
    listeners.push(listener);
  }

  static onDown(event) {
    Cursor.x = event.clientX;
    Cursor.y = event.clientY;
    Cursor.dragStartX = Cursor.x;
    Cursor.dragStartY = Cursor.y;
    Cursor.dragButton = event.button;
    Cursor.isDown[event.button] = true;
    for (const listener of listeners) {
      listener.onCursorDown?.(event.button);
    }
  }

  static onUp(event) {
    Cursor.x = event.clientX;
    Cursor.y = event.clientY;
    if (Cursor.dragButton == event.button) {
      Cursor.dragButton = null;
    }
    Cursor.isDown[event.button] = true;
    for (const listener of listeners) {
      listener.onCursorUp?.(event.button);
    }
  }

  static onMove(event) {
    Cursor.x = event.clientX;
    Cursor.y = event.clientY;
    for (const listener of listeners) {
      listener.onCursorMove?.();
    }
  }
}
