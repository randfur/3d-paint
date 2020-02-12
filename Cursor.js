import {width, height} from './utils.js';

let listeners = [];

// TODO:
// Event sequence graph:
// S -> onDown -> onClick -> S
//             -> onDragStart -> onDrag -> onDragEnd -> S
//   -> onMove -> S

export class Cursor {
  static left = 0;
  static middle = 1;
  static right = 2;

  static x = width / 2;
  static y = height / 2;

  static isDown = {};

  static firstDownButton = null;
  static isDragging = false;
  static dragX = null;
  static dragY = null;

  static addListener(listener) {
    listeners.push(listener);
  }

  static onDown = Symbol();
  static onDownEvent(event) {
    if (Cursor.firstDownButton !== null) {
      return;
    }
    Cursor.x = event.clientX;
    Cursor.y = event.clientY;
    Cursor.dragX = 0;
    Cursor.dragY = 0;
    Cursor.firstDownButton = event.button;
    Cursor.isDown[event.button] = true;
    for (const listener of listeners) {
      listener[Cursor.onDown]?.(event.button);
    }
  }

  static onDragStart = Symbol();
  static onDrag = Symbol();
  static onMove = Symbol();
  static onMoveEvent(event) {
    Cursor.x = event.clientX;
    Cursor.y = event.clientY;

    const wasDragging = Cursor.isDragging;
    if (Cursor.firstDownButton !== null) {
      Cursor.isDragging = true;
    }
    if (Cursor.isDragging) {
      Cursor.dragX += event.movementX;
      Cursor.dragY += event.movementY;
      if (!wasDragging) {
        for (const listener of listeners) {
          listener[Cursor.onDragStart]?.(Cursor.firstDownButton);
        }
      }
    }
    for (const listener of listeners) {
      if (Cursor.isDragging) {
        listener[Cursor.onDrag]?.();
      } else {
        listener[Cursor.onMove]?.();
      }
    }
  }

  static onClick = Symbol();
  static onDragEnd = Symbol();
  static onUpEvent(event) {
    if (Cursor.firstDownButton != event.button) {
      return;
    }
    Cursor.x = event.clientX;
    Cursor.y = event.clientY;
    Cursor.isDown[event.button] = false;
    for (const listener of listeners) {
      if (Cursor.isDragging) {
        listener[Cursor.onDragEnd]?.(event.button);
      } else {
        listener[Cursor.onClick]?.(event.button);
      }
    }
    Cursor.firstDownButton = null;
    Cursor.isDragging = false;
    Cursor.dragX = null;
    Cursor.dragY = null;
  }
}
