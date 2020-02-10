import {width, height} from './utils.js';

let listeners = [];

// TODO:
// Event sequence graph:
// neutral -> onMove
//         -> onDown -> onClick
//                   -> onDrag -> onDragEnd

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

  static onDown = Symbol();
  static onDownEvent(event) {
    if (Cursor.dragButton !== null) {
      return;
    }
    Cursor.x = event.clientX;
    Cursor.y = event.clientY;
    Cursor.dragStartX = Cursor.x;
    Cursor.dragStartY = Cursor.y;
    Cursor.dragButton = event.button;
    Cursor.isDown[event.button] = true;
    for (const listener of listeners) {
      listener[Cursor.onDown]?.(event.button);
    }
  }

  static onUp = Symbol();
  static onUpEvent(event) {
    if (Cursor.dragButton != event.button) {
      return;
    }
    Cursor.x = event.clientX;
    Cursor.y = event.clientY;
    Cursor.isDown[event.button] = false;
    for (const listener of listeners) {
      listener[Cursor.onUp]?.(event.button);
    }
    Cursor.dragButton = null;
  }

  static onMove = Symbol();
  static onMoveEvent(event) {
    Cursor.x = event.clientX;
    Cursor.y = event.clientY;
    for (const listener of listeners) {
      listener[Cursor.onMove]?.();
    }
  }
}
