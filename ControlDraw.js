import {Cursor} from './Cursor.js';
import {Frames} from './Frames.js';
import {Controls} from './Controls.js';
import {Camera} from './Camera.js';
import {Vector} from './Vector.js';
import {Surface} from './Surface.js';

let selected = null;

export class ControlDraw {

  static [Controls.handleCursorDragStart](button) {
    if (button != Cursor.left) {
      return;
    }

    const canvasPosition = Vector.getTemp();
    let smallestT = Infinity;
    selected = null;
    for (const surface of Surface.all) {
      const t = surface.hitTest(Camera.position, Camera.cursorRayDirection, canvasPosition);
      if (t !== null && t < smallestT) {
        selected = surface;
        smallestT = t;
      }
    }
    Vector.releaseTemp(1);

    if (selected) {
      return Controls.consume;
    }
  }

  static [Controls.handleCursorDrag]() {
    const canvasPosition = Vector.getTemp();
    if (selected.hitTest(Camera.position, Camera.cursorRayDirection, canvasPosition) !== null) {
      selected.context.fillRect(
          Math.round(canvasPosition.x) - 5,
          Math.round(canvasPosition.y) - 5,
          10, 10);
      selected.uploadTexture();
      Frames.scheduleRedraw();
    }
    Vector.releaseTemp(1);
  }
}