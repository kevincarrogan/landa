class EditorStorage {
  constructor(initialValue) {
    this.key = "landa-editor";

    if (localStorage.getItem(this.key) === null) {
      localStorage.setItem(this.key, initialValue);
    }
  }

  get() {
    return localStorage.getItem(this.key);
  }

  set(value) {
    localStorage.setItem(this.key, value);
  }
}

export { EditorStorage };
