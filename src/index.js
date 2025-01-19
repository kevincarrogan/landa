import Matter from "matter-js";
import { Game } from "./game";
import { Renderer } from "./renderer";
import { Editor } from "./editor";
import { get_parser as getParser } from "./parser";
import { sleep } from "./utils";
import { FunctionTransform } from "./transformers";
import { FunctionRunner } from "./function-runner";
import "./main.scss";

const width = 640;
const height = 480;

const game = new Game(width, height);

const $canvas = document.querySelector("#canvas");
new Renderer(game, $canvas, width, height);

const $editor = document.querySelector("#editor");
const editor = new Editor($editor);

const functions = {
  setThrust: async ({ to, for: _for }) => {
    game.rocket.setThrust(to.value);
    await sleep(_for.toNumber("ms"));
    game.rocket.setThrust(0);
  },

  rotate: ({ to }) => {
    game.rocket.rotate(to.toNumber("rad"));
  },

  wait: async ({ for: _for }) => {
    await sleep(_for.toNumber("ms"));
  },
};

const $playButton = document.querySelector("#play");
$playButton.addEventListener("click", () => {
  game.setup();
  game.run();
  window.Matter = Matter;
  window.rocket = game.rocket;
});

const $runButton = document.querySelector("#run");

const functionRunner = new FunctionRunner(functions);

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

const parser = getParser();
$runButton.addEventListener("click", () => {
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
});
