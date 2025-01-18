import { Bodies, Composite, Engine, Events, Runner, Vertices } from "matter-js";
import p5 from "p5";
import { minimalEditor } from "prism-code-editor/setups";
import { Rocket } from "./rocket";
import { get_parser as getParser } from "./parser";
import { roundToNearest, sleep } from "./utils";
import { FunctionTransform } from "./transformers";
import { FunctionRunner } from "./function-runner";
import "./main.scss";

const width = 640;
const height = 480;

const ROUND_TO = 5;
const BOX_SIZE = 4;

const engine = Engine.create({
  gravity: { x: 0, y: 0.16, scale: 0.001 },
});

const rocketBody = Bodies.fromVertices(400, 300, [
  { x: 0, y: 60 },
  { x: 60, y: 60 },
  { x: 30, y: 0 },
]);
const rocket = new Rocket(rocketBody, engine.gravity);

const mainSketch = (p) => {
  const drawPixel = ({ x, y }) => {
    p.square(x, y, BOX_SIZE);
  };

  let composite;
  p.setup = () => {
    const canvasElement = document.querySelector("#canvas");
    p.createCanvas(width, height, canvasElement);

    const bodies = [
      rocketBody,
      Bodies.rectangle(width / 2, height - 10, width, 20, { isStatic: true }),
    ];

    composite = Composite.add(engine.world, bodies);

    const runner = Runner.create();
    Runner.run(runner, engine);

    Events.on(runner, "beforeUpdate", () => {
      rocket.applyThrust();
    });
  };
  p.draw = () => {
    p.background(255);
    p.noStroke();
    for (const body of composite.bodies) {
      for (
        let x = roundToNearest(ROUND_TO, body.bounds.min.x);
        x < body.bounds.max.x;
        x += ROUND_TO
      ) {
        for (
          let y = roundToNearest(ROUND_TO, body.bounds.min.y);
          y < body.bounds.max.y;
          y += ROUND_TO
        ) {
          const point = {
            x,
            y,
          };
          if (Vertices.contains(body.vertices, point)) {
            if (x % 10 === 0) {
              if (y % 10 === 0) {
                p.fill(150);
              } else {
                p.fill(0);
              }
            } else {
              if (y % 10 === 0) {
                p.fill(0);
              } else {
                p.fill(150);
              }
            }
            drawPixel(point);
          }
        }
      }
    }
  };
};

new p5(mainSketch);

const $editor = document.querySelector("#editor");

const editor = minimalEditor(
  $editor,
  {
    theme: "github-light",
  },
  () => {
    editor.textarea.focus();
  }
);

const parser = getParser();

const functions = {
  setThrust: async ({ to, for: _for }) => {
    rocket.setThrust(to / 10);
    await sleep(_for * 1000);
    rocket.setThrust(0);
  },
};

const functionRunner = new FunctionRunner(functions);

functionRunner.on("run:start", () => {
  editor.setOptions({ readOnly: true });
});

let element;
functionRunner.on("call:start", (lineNumber) => {
  element = document.createElement("div");
  element.style.position = "absolute";
  element.style.inset = "0";
  element.style.zIndex = "-1";
  element.style.background = "red";

  const lines = editor.wrapper.children;
  lines[lineNumber].prepend(element);
});

functionRunner.on("call:end", () => {
  element.remove();
});

functionRunner.on("run:end", () => {
  editor.setOptions({ readOnly: false });
});

const $runButton = document.querySelector("#run");
$runButton.addEventListener("click", () => {
  const val = editor.textarea.value;
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
