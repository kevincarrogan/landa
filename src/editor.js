import { minimalEditor } from "prism-code-editor/setups";

class Editor {
  constructor($el) {
    this.setup($el);
    this.highlightMap = {};
  }

  setup($el) {
    this.editor = minimalEditor(
      $el,
      {
        theme: "github-light",
      },
      () => {
        this.editor.textarea.focus();
      }
    );
  }

  enable() {
    this.editor.setOptions({ readOnly: false });
  }

  disable() {
    this.editor.setOptions({ readOnly: true });
  }

  highlightLine(lineNumber) {
    const element = document.createElement("div");
    element.style.position = "absolute";
    element.style.inset = "0";
    element.style.zIndex = "-1";
    element.style.background = "red";

    const lines = this.editor.wrapper.children;
    lines[lineNumber].prepend(element);

    this.highlightMap[lineNumber] = element;
  }

  removeHighlight(lineNumber) {
    const element = this.highlightMap[lineNumber];
    element.remove();
    delete this.highlightLine[lineNumber];
  }

  getValue() {
    return this.editor.textarea.value;
  }
}

export { Editor };
