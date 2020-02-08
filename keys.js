const listeners = [];

export class Keys {
  static isDown = {};

  static addListener(listener) {
    listeners.push(listener);
  }

  static stripModifierSide(code) {
    for (let modifier of ['Ctrl', 'Alt', 'Shift', 'Meta']) {
      if (code.startsWith(modifier)) {
        return modifier;
      }
    }
    return code;
  }

  static onDown(event) {
    let code = Keys.stripModifierSide(event.code);
    Keys.isDown[code] = true;
    for (const listener of listeners) {
      listener.onKeyDown?.(code);
    }
  }

  static onUp(event) {
    let code = Keys.stripModifierSide(event.code);
    Keys.isDown[code] = false;
    for (const listener of listeners) {
      listener.onKeyUp?.(code);
    }
  }
}