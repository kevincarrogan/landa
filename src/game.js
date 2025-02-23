import Matter from "matter-js";
import { Rocket } from "./rocket";
import { SpriteEmitter } from "./sprite-emitter";
import {
  STATIC_CATEGORY,
  ROCKET_CATEGORY,
  SPRITE_CATEGORY,
} from "./collision-categories";
import { create, unitDependencies } from "mathjs";

const math = create({
  unitDependencies,
});

class Game {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.spriteDecay = 500;
    this.spriteRate = math.unit(60, "Hz");
    this.setup();
  }

  setup() {
    const engine = Matter.Engine.create({
      gravity: { x: 0, y: 0.16, scale: 0.001 },
    });

    const runner = Matter.Runner.create();

    const ground = Matter.Bodies.rectangle(
      this.width / 2,
      this.height - 10,
      this.width,
      20,
      {
        collisionFilter: {
          category: STATIC_CATEGORY,
          mask: ROCKET_CATEGORY | SPRITE_CATEGORY,
        },
        isStatic: true,
        label: "ground",
      }
    );

    const ROCKET_HEIGHT = 40;
    const ROCKET_WIDTH = 40;

    const rocketBody = Matter.Bodies.fromVertices(
      0,
      0,
      [
        { x: 0, y: ROCKET_HEIGHT },
        { x: ROCKET_HEIGHT, y: ROCKET_HEIGHT },
        { x: ROCKET_WIDTH / 2, y: 0 },
      ],
      {
        label: "rocket",
        collisionFilter: {
          category: ROCKET_CATEGORY,
          mask: STATIC_CATEGORY | SPRITE_CATEGORY,
        },
      }
    );

    Matter.Body.setPosition(
      rocketBody,
      Matter.Vector.create(
        ROCKET_WIDTH / 2 + 20,
        ground.bounds.min.y - (rocketBody.bounds.max.y - rocketBody.position.y)
      )
    );
    this.rocket = new Rocket(rocketBody, engine.gravity);

    const landingPad = Matter.Bodies.rectangle(
      400,
      ground.bounds.max.y - 10 - 20,
      60,
      20,
      {
        collisionFilter: {
          category: STATIC_CATEGORY,
          mask: ROCKET_CATEGORY,
        },
        isStatic: true,
        label: "lander",
      }
    );

    const spriteComposite = Matter.Composite.create();
    const spriteEmitter = new SpriteEmitter(
      rocketBody.bounds.min.x + ROCKET_WIDTH / 2,
      rocketBody.bounds.max.y,
      this.spriteRate,
      5,
      runner.delta,
      this.spriteDecay,
      spriteComposite
    );
    this.sprites = spriteComposite;

    const bodies = [rocketBody, ground, landingPad, spriteComposite];

    this.composite = Matter.Composite.add(engine.world, bodies);

    Matter.Events.on(runner, "beforeUpdate", (evt) => {
      this.rocket.applyThrust();
      this.rocket.applyAngle();

      spriteEmitter.tick(evt.timestamp);
      spriteEmitter.setPosition(this.rocket.body.position);
    });

    Matter.Events.on(engine, "collisionActive", (collision) => {
      if (
        !Matter.Collision.collides(
          rocketBody,
          landingPad,
          collision.source.pairs
        )
      ) {
        return;
      }

      this.completeLevel();
    });

    this.runner = runner;
    this.engine = engine;
    this.spriteEmitter = spriteEmitter;
  }

  getBodies(bounds) {
    return Matter.Query.region(this.composite.bodies, bounds);
  }

  getSprites(bounds) {
    return Matter.Query.region(
      Matter.Composite.allBodies(this.sprites),
      bounds
    );
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

  completeLevel() {
    console.log("Completed level");
  }

  setSpriteDecay(decayTime) {
    this.spriteEmitter.setSpriteDecay(decayTime);
  }

  setSpriteRate(rate) {
    this.spriteEmitter.setSpriteRate(rate);
  }
}

export { Game };
