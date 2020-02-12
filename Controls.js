import {assert} from './utils.js';
import {Cursor} from './Cursor.js';
import {Frames} from './Frames.js';

export class Controls {
  static consume = Symbol();

  static all = [];

  static hanglingDrag = null;

  static add(control) {
    Controls.all.push(control);
  }

  static handleCursorClick = Symbol();
  static [Cursor.onClick](button) {
    assert(!Controls.hanglingDrag);
    for (const control of Controls.all) {
      if (control[Controls.handleCursorClick]?.(button) == Controls.consume) {
        break;
      }
    }
  }

  static handleCursorDragStart = Symbol();
  static [Cursor.onDragStart](button) {
    for (const control of Controls.all) {
      if (control[Controls.handleCursorDragStart]?.(button) == Controls.consume) {
        Controls.hanglingDrag = control;
        break;
      }
    }
  }

  static handleCursorDrag = Symbol();
  static [Cursor.onDrag]() {
    Controls.hanglingDrag?.[Controls.handleCursorDrag]?.();
  }

  static handleCursorDragEnd = Symbol();
  static [Cursor.onDragEnd]() {
    if (Controls.hanglingDrag) {
      Controls.hanglingDrag[Controls.handleCursorDragEnd]?.();
      Controls.hanglingDrag = null;
    }
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
