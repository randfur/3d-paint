export class Debug {
  static init() {
    window.addEventListener('error', event => {
      window.output.textContent = event.error.stack;
    });
  }

  static done(variables) {
    Object.assign(window, variables);
    console.log('All good.');
  }
}
