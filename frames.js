const listeners = [];

export class Frames {
  static time = 0;
  static redrawScheduled = false;

  static init() {
    requestAnimationFrame(Frames.frame);
  }

  static addListener(listener) {
    listeners.push(listener);
  }

  static frame(newTime) {
    const delta = newTime - Frames.time;
    Frames.time = newTime;
    for (const listener of listeners) {
      listener.onFrame?.(delta, Frames.time);
    }

    if (Frames.redrawScheduled) {
      for (const listener of listeners) {
        listener.onRedraw?.();
      }
      Frames.redrawScheduled = false;
    }
    requestAnimationFrame(Frames.frame);
  }

  static scheduleRedraw() {
    Frames.redrawScheduled = true;
  }
}