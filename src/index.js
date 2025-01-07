import {
  Engine,
  Render,
  Runner,
  Bodies,
  Composite,
  Mouse,
  MouseConstraint,
  Vertices,
} from "matter-js";
import p5 from "p5";

const element = document.querySelector("#container");
const width = 800;
const height = 600;

const engine = Engine.create();
const render = Render.create({
  element,
  engine,
  options: {
    height,
    width,
  },
});

const bodies = [
  Bodies.rectangle(400, 200, 80, 80),
  Bodies.rectangle(450, 50, 80, 80),
  Bodies.rectangle(400, 610, 810, 60, { isStatic: true }),
];

// add mouse control
const mouse = Mouse.create(render.canvas),
  mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
      stiffness: 0.2,
      render: {
        visible: false,
      },
    },
  });

Composite.add(engine.world, mouseConstraint);
Composite.add(engine.world, bodies);

Render.run(render);

const runner = Runner.create();
Runner.run(runner, engine);

const roundToNearest = (toNearest, original) => {
  return Math.round(original / toNearest) * toNearest;
};

const ROUND_TO = 10;
const BOX_SIZE = 7;

const mainSketch = (p) => {
  p.setup = () => {
    p.createCanvas(width, height);
  };
  p.draw = () => {
    p.background(255);
    p.fill(0);
    p.noStroke();
    for (const body of bodies) {
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
