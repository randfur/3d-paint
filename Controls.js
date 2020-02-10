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
  static handleCursorMove = Symbol();
  static [Cursor.onMove]() {
    const isHandlingCursor = Boolean(Controls.handlingCursor);
    if (isHandlingCursor) {
      Controls.handlingCursor[Controls.handleCursorDrag]?.();
      return;
    }
    if (Cursor.dragButton !== null) {
      return;
    }
    for (const control of Controls.all) {
      if (control[Controls.handleCursorMove]?.() == Controls.consume) {
        break;
      }
    }
  }

  static [Cursor.onUp](button) {
    // TODO: Add handling code for drag end and cursor up if anything wants it.
    Controls.handlingCursor = null;
  }

  static [Frames.onFrame]() {
    for (const control of Controls.all) {
      control.handleFrame?.();
    }
  }
}