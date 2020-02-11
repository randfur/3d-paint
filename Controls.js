import {assert} from './utils.js';
import {Cursor} from './Cursor.js';
import {Frames} from './Frames.js';

export class Controls {
  static consume = Symbol();

  static all = [];

  static handlingCursor = null;

  static add(control) {
    Controls.all.push(control);
  }

  static handleCursorDown = Symbol();
  static [Cursor.onDown](button) {
    assert(!Controls.handlingCursor);
    for (const control of Controls.all) {
      if (control[Controls.handleCursorDown]?.(button) == Controls.consume) {
        Controls.handlingCursor = control;
        break;
      }
    }
  }

  static handleCursorDrag = Symbol();
  static [Cursor.onDrag]() {
    Controls.handlingCursor?.[Controls.handleCursorDrag]?.();
  }

  static [Cursor.onDragEnd]() {
    Controls.handlingCursor = null;
  }

  static [Cursor.onClick]() {
    Controls.handlingCursor = null;
  }

  static handleFrame = Symbol();
  static [Frames.onFrame](delta, time) {
    for (const control of Controls.all) {
      if (control[Controls.handleFrame]?.(delta, time) == Controls.consume) {
        break;
      }
    }
  }
}
