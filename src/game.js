import Matter from "matter-js";
import { Rocket } from "./rocket";

class Game {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.setup();
  }

  setup() {
    const engine = Matter.Engine.create({
      gravity: { x: 0, y: 0.16, scale: 0.001 },
    });

    const rocketBody = Matter.Bodies.fromVertices(400, 300, [
      { x: 0, y: 40 },
      { x: 40, y: 40 },
      { x: 20, y: 0 },
    ]);
    this.rocket = new Rocket(rocketBody, engine.gravity);

    const bodies = [
      rocketBody,
      Matter.Bodies.rectangle(
        this.width / 2,
        this.height - 10,
        this.width,
        20,
        {
          isStatic: true,
        }
      ),
    ];

    this.composite = Matter.Composite.add(engine.world, bodies);

    const runner = Matter.Runner.create();

    Matter.Events.on(runner, "beforeUpdate", () => {
      this.rocket.applyThrust();
      this.rocket.applyAngle();
    });

    this.runner = runner;
    this.engine = engine;
  }

  getBodies(bounds) {
    if (!bounds) {
      bounds = {
        min: { x: 0, y: 0 },
        max: { x: this.width, y: this.height },
      };
    }
    return Matter.Query.region(this.composite.bodies, bounds);
  }

  contains(body, point) {
    return Matter.Vertices.contains(body.vertices, point);
  }

  run() {
    Matter.Runner.run(this.runner, this.engine);
  }

  pause() {
    Matter.Runner.stop(this.runner);
  }
}

export { Game };
