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

    const ground = Matter.Bodies.rectangle(
      this.width / 2,
      this.height - 10,
      this.width,
      20,
      {
        isStatic: true,
      }
    );

    const ROCKET_HEIGHT = 40;
    const ROCKET_WIDTH = 40;

    const rocketBody = Matter.Bodies.fromVertices(0, 0, [
      { x: 0, y: ROCKET_HEIGHT },
      { x: ROCKET_HEIGHT, y: ROCKET_HEIGHT },
      { x: ROCKET_WIDTH / 2, y: 0 },
    ]);

    Matter.Body.setPosition(
      rocketBody,
      Matter.Vector.create(
        ROCKET_WIDTH / 2 + 20,
        ground.bounds.min.y - (rocketBody.bounds.max.y - rocketBody.position.y)
      )
    );
    this.rocket = new Rocket(rocketBody, engine.gravity);

    const bodies = [rocketBody, ground];

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
