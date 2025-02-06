import { minimalEditor } from "prism-code-editor/setups";
import { EventEmitter } from "events";

class Editor extends EventEmitter {
  STYLES = {
    HIGHLIGHT: "yellow",
    ERROR: "red",
  };

  constructor($el, initialValue) {
    super();
    this.setup($el, initialValue);
    this.highlightMap = new Map();
  }

  setup($el, initialValue) {
    this.editor = minimalEditor(
      $el,
      {
        theme: "github-light",
        value: initialValue,
        onUpdate: (value) => {
          this.emit("change", value);
        },
      },
      () => {
        this.editor.textarea.focus();
      }
    );

    const oldEnterCallback = this.editor.keyCommandMap.Enter;
    this.editor.keyCommandMap.Enter = (e, selection, value) => {
      if (e.metaKey) {
        this.emit("submit");
        return true;
      }
      if (!oldEnterCallback) {
        return;
      }
      return oldEnterCallback(e, selection, value);
    };
  }

  enable() {
    this.editor.setOptions({ readOnly: false });
  }

  disable() {
    this.editor.setOptions({ readOnly: true });
  }

  highlightLine(lineNumber, style) {
    if (this.highlightMap.has(lineNumber)) {
      this.removeHighlight(lineNumber);
    }

    const element = document.createElement("div");
    element.style.position = "absolute";
    element.style.inset = "0";
    element.style.zIndex = "-1";
    element.style.background = style;

    const lines = this.editor.wrapper.children;
    lines[lineNumber].prepend(element);

    this.highlightMap.set(lineNumber, element);
  }

  removeHighlight(lineNumber) {
    const element = this.highlightMap.get(lineNumber);
    element.remove();
    this.highlightMap.delete(lineNumber);
  }

  clearHighlights() {
    for (const element of Object.values(this.highlightMap)) {
      element.remove();
    }
    this.highlightMap.clear();
  }

  getValue() {
    return this.editor.textarea.value;
  }
}

export { Editor };
