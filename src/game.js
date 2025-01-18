import { Bodies, Composite, Engine, Events, Runner, Vertices } from "matter-js";
import { Rocket } from "./rocket";

class Game {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.setup();
  }

  setup() {
    const engine = Engine.create({
      gravity: { x: 0, y: 0.16, scale: 0.001 },
    });

    const rocketBody = Bodies.fromVertices(400, 300, [
      { x: 0, y: 60 },
      { x: 60, y: 60 },
      { x: 30, y: 0 },
    ]);
    this.rocket = new Rocket(rocketBody, engine.gravity);

    const bodies = [
      rocketBody,
      Bodies.rectangle(this.width / 2, this.height - 10, this.width, 20, {
        isStatic: true,
      }),
    ];

    this.composite = Composite.add(engine.world, bodies);

    const runner = Runner.create();

    Events.on(runner, "beforeUpdate", () => {
      this.rocket.applyThrust();
    });

    this.runner = runner;
    this.engine = engine;
  }

  getBodies() {
    return this.composite.bodies;
  }

  contains(body, point) {
    return Vertices.contains(body.vertices, point);
  }

  run() {
    Runner.run(this.runner, this.engine);
  }

  pause() {
    Runner.stop(this.runner);
  }
}

export { Game };
