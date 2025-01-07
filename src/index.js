import {
  Engine,
  Render,
  Runner,
  Bodies,
  Composite,
  Mouse,
  MouseConstraint,
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

const boxA = Bodies.rectangle(400, 200, 80, 80);
const boxB = Bodies.rectangle(450, 50, 80, 80);
const ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true });

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
Composite.add(engine.world, [boxA, boxB, ground]);

Render.run(render);

const runner = Runner.create();
Runner.run(runner, engine);

const mainSketch = (p) => {
  p.setup = () => {
    p.createCanvas(width, height);
  };
  p.draw = () => {
    p.background(255);

    p.fill(0);
    p.noStroke();
    for (let x = 0; x < width; x += 5) {
      for (let y = 0; y < height; y += 5) {
        p.square(x, y, 4);
      }
    }
  };
};

new p5(mainSketch);
