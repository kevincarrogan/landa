class EditorStorage {
  constructor() {
    this.key = "landa-editor";
  }

  get() {
    return localStorage.getItem(this.key);
  }

  set(value) {
    localStorage.setItem(this.key, value);
  }
}

export { EditorStorage };
