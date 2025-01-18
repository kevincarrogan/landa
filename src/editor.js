import { minimalEditor } from "prism-code-editor/setups";

class Editor {
  STYLES = {
    HIGHLIGHT: "yellow",
    ERROR: "red",
  };

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

  highlightLine(lineNumber, style) {
    if (this.highlightMap[lineNumber]) {
      this.removeHighlight(lineNumber);
    }

    const element = document.createElement("div");
    element.style.position = "absolute";
    element.style.inset = "0";
    element.style.zIndex = "-1";
    element.style.background = style;

    const lines = this.editor.wrapper.children;
    lines[lineNumber].prepend(element);

    this.highlightMap[lineNumber] = element;
  }

  removeHighlight(lineNumber) {
    const element = this.highlightMap[lineNumber];
    element.remove();
    delete this.highlightMap[lineNumber];
  }

  clearHighlights() {
    for (const element of Object.values(this.highlightMap)) {
      element.remove();
    }
    this.highlightMap = {};
  }

  getValue() {
    return this.editor.textarea.value;
  }
}

export { Editor };
