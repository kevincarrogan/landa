import Matter from "matter-js";
import {
  create,
  createUnitDependencies,
  evaluateDependencies,
  unitDependencies,
} from "mathjs";
import { Game } from "./game";
import { Renderer } from "./renderer";
import { Editor } from "./editor";
import { get_parser as getParser } from "./parser";
import { sleep } from "./utils";
import { FunctionTransform } from "./transformers";
import { FunctionRunner } from "./function-runner";
import "./main.scss";

const math = create({
  createUnitDependencies,
  evaluateDependencies,
  unitDependencies,
});
math.createUnit("percent", "0.01");

window.math = math;

const width = 640;
const height = 480;

const game = new Game(width, height);

const $canvas = document.querySelector("#canvas");
new Renderer(game, $canvas, width, height);

const $editor = document.querySelector("#editor");
const editor = new Editor($editor);

const functions = {
  setThrust: async ({ to, for: _for }) => {
    game.rocket.setThrust(math.evaluate(`${to} percent`));
    await sleep(_for * 1000);
    game.rocket.setThrust(0);
  },

  rotate: ({ to }) => {
    const radians = math.unit(to, "deg").toNumber("rad");
    game.rocket.rotate(radians);
  },

  wait: async ({ for: _for }) => {
    await sleep(_for * 1000);
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
  editor.removeHighlight(lineNumber);
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
    return;
  }

  const transformer = new FunctionTransform();
  const functionCalls = transformer.transform(tree);

  functionRunner.run(functionCalls);
});
