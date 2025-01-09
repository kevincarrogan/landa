import { Engine, Runner, Bodies, Composite, Vertices } from "matter-js";
import p5 from "p5";
import { minimalEditor } from "prism-code-editor/setups";

const width = 800;
const height = 600;

const roundToNearest = (toNearest, original) => {
  return Math.round(original / toNearest) * toNearest;
};

const ROUND_TO = 5;
const BOX_SIZE = 4;

const mainSketch = (p) => {
  const drawPixel = ({x, y}) => {
    p.square(x, y, BOX_SIZE);
  }

  let composite;
  p.setup = () => {
    const canvasElement = document.querySelector("#canvas");
    p.createCanvas(width, height, canvasElement);

    const engine = Engine.create();

    const bodies = [
      Bodies.trapezoid(100, height - (75 / 2) + 20, 90, 100, 1),
      Bodies.rectangle(width / 2, height - 10, width, 20, { isStatic: true }),
    ];

    composite = Composite.add(engine.world, bodies);

    const runner = Runner.create();
    Runner.run(runner, engine);
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
                p.fill(100);
              } else {
                p.fill(0);
              }
            } else {
              if (y % 10 === 0) {
                p.fill(0);
              } else {
                p.fill(100);
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

minimalEditor(
  "#editor",
  {
    theme: "github-light",
  },
  () => console.log("ready")
);
