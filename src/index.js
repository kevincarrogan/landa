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

const parser = getParser();

const functions = {
  setThrust: async ({ to, for: _for }) => {
    game.rocket.setThrust(to / 10);
    await sleep(_for * 1000);
    game.rocket.setThrust(0);
  },
};

const functionRunner = new FunctionRunner(functions);

functionRunner.on("run:start", () => {
  editor.disable();
});

functionRunner.on("call:start", (lineNumber) => {
  editor.highlightLine(lineNumber);
});

functionRunner.on("call:end", (lineNumber) => {
  editor.removeHighlight(lineNumber);
});

functionRunner.on("run:end", () => {
  editor.enable();
});

const $runButton = document.querySelector("#run");
$runButton.addEventListener("click", () => {
  const val = editor.getValue();
  let tree;
  try {
    tree = parser.parse(val);
  } catch (error) {
    console.error(error);
    return;
  }

  const transformer = new FunctionTransform();
  const functionCalls = transformer.transform(tree);

  functionRunner.run(functionCalls);
});
