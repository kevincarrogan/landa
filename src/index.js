import { Game } from "./game";
import { Renderer } from "./renderer";
import { Editor } from "./editor";
import { get_parser as getParser } from "./parser";
import { sleep } from "./utils";
import { FunctionTransform } from "./transformers";
import { FunctionRunner } from "./function-runner";
import { EditorStorage } from "./editor-storage";
import "./main.scss";

const width = 640;
const height = 480;

const game = new Game(width, height);

const $canvas = document.querySelector("#canvas");
new Renderer(game, $canvas, width, height);

const storage = new EditorStorage(
  "setThrust(to: 21%)\nwait(for: 500ms)\nrotate(to: 45deg)\nwait(for: 1000ms)\nrotate(to: 0deg)\nsetThrust(to: 0%)\nwait(for: 5s)"
);

const $editor = document.querySelector("#editor-wrapper");
const editor = new Editor($editor, storage.get());

const functionRunner = new FunctionRunner();
functionRunner.register(async function setThrust(to, _for) {
  game.rocket.setThrust(to.value);
  await sleep(_for.toNumber("ms"));
  game.rocket.setThrust(0);
});

functionRunner.register(function setThrust(to) {
  game.rocket.setThrust(to.value);
});

functionRunner.register(function rotate(to) {
  game.rocket.rotateTo(to.toNumber("rad"));
});

functionRunner.register(function rotate(by) {
  game.rocket.rotateBy(by.toNumber("rad"));
});

functionRunner.register(async function wait(_for) {
  await sleep(_for.toNumber("ms"));
});

const $runButton = document.querySelector("#run");

functionRunner.on("run:start", () => {
  editor.clearHighlights();
  editor.disable();
  game.setup();
  game.run();
  $runButton.disabled = true;
});

functionRunner.on("call:start", (lineNumber) => {
  editor.highlightLine(lineNumber, editor.STYLES.HIGHLIGHT);
});

functionRunner.on("call:error", (lineNumber) => {
  editor.highlightLine(lineNumber, editor.STYLES.ERROR);
});

functionRunner.on("call:end", (lineNumber) => {
  setTimeout(() => editor.removeHighlight(lineNumber), 50);
});

functionRunner.on("run:end", () => {
  editor.enable();
  game.pause();
  $runButton.disabled = false;
});

const runCode = () => {
  const val = editor.getValue();
  let tree;
  try {
    tree = parser.parse(val);
  } catch (error) {
    editor.highlightLine(error.line, editor.STYLES.ERROR);
    console.error(error);
    return;
  }

  const transformer = new FunctionTransform();
  const functionCalls = transformer.transform(tree);

  functionRunner.run(functionCalls);
};

const parser = getParser();
$runButton.addEventListener("click", () => runCode());

editor.on("submit", () => runCode());
editor.on("change", (value) => storage.set(value));
