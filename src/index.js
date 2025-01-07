import { Engine, Runner, Bodies, Composite, Vertices } from "matter-js";
import p5 from "p5";

const width = 800;
const height = 600;

const roundToNearest = (toNearest, original) => {
  return Math.round(original / toNearest) * toNearest;
};

const ROUND_TO = 4;
const BOX_SIZE = 2;

let bodies = [];

const mainSketch = (p) => {
  let composite;
  p.setup = () => {
    p.createCanvas(width, height);

    const engine = Engine.create();

    bodies = [
      Bodies.trapezoid(100, 100, 60, 75, 1),
      Bodies.rectangle(0, 600 - 10, width * 2, 20, { isStatic: true }),
    ];

    composite = Composite.add(engine.world, bodies);

    const runner = Runner.create();
    Runner.run(runner, engine);
  };
  p.draw = () => {
    p.background(255);
    p.fill(0);
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
          if (Vertices.contains(body.vertices, { x, y })) {
            p.square(x, y, BOX_SIZE);
          }
        }
      }
    }
  };
};

new p5(mainSketch);
