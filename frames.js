const listeners = [];

export class Frames {
  static time = 0;
  static redraw = null;
  static redrawScheduled = true;

  static init(redraw) {
    Frames.redraw = redraw;
    requestAnimationFrame(Frames.frame);
  }

  static addListener(listener) {
    listeners.push(listener);
  }

  static onFrame = Symbol();
  static frame(newTime) {
    const delta = newTime - Frames.time;
    Frames.time = newTime;
    for (const listener of listeners) {
      listener[Frames.onFrame]?.(delta, Frames.time);
    }

    if (Frames.redrawScheduled) {
      Frames.redraw();
      Frames.redrawScheduled = false;
    }
    requestAnimationFrame(Frames.frame);
  }

  static scheduleRedraw() {
    Frames.redrawScheduled = true;
  }
}