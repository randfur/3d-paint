const listeners = [];

export class Keys {
  static isDown = {};

  static addListener(listener) {
    listeners.push(listener);
  }

  static onDown({key}) {
    Keys.isDown[key] = true;
    for (const listener of listeners) {
      listener.onKeyDown?.(key);
    }
  }

  static onUp({key}) {
    Keys.isDown[key] = false;
    for (const listener of listeners) {
      listener.onKeyUp?.(key);
    }
  }
}