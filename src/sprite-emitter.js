import Matter from "matter-js";
import collection from "lodash/collection";
import { create, randomDependencies, unitDependencies } from "mathjs";
import {
  ROCKET_CATEGORY,
  SPRITE_CATEGORY,
  STATIC_CATEGORY,
} from "./collision-categories";

const math = create({
  randomDependencies,
  unitDependencies,
});

class SpriteEmitter {
  constructor(x, y, rate, randomiseRate, delta, decay, spriteComposite) {
    this.x = x;
    this.y = y;
    this.rate = rate;
    this.randomiseRate = randomiseRate;
    this.delta = delta;
    this.decay = decay;
    this.lastTimestamp = null;

    this.composite = Matter.Composite.create();
    Matter.Composite.add(spriteComposite, this.composite);

    this.sprites = [];
  }

  emitSprite(startTimestamp) {
    const body = Matter.Bodies.rectangle(this.x - 20, this.y - 20, 10, 10, {
      collisionFilter: {
        category: SPRITE_CATEGORY,
        mask: STATIC_CATEGORY | ROCKET_CATEGORY,
      },
    });
    const spread = math.unit(math.random(-15, 15), "deg").toNumber("rad");
    const force = Matter.Vector.create(
      0.001 * Math.sin(spread),
      -0.001 * Math.cos(spread)
    );
    Matter.Composite.add(this.composite, body);
    Matter.Body.applyForce(body, body.position, force);
    this.sprites.push((timestamp) => {
      if (timestamp - startTimestamp >= this.decay) {
        Matter.Composite.remove(this.composite, body);
        return false;
      }
      return true;
    });
  }

  tick(timestamp) {
    this.sprites = this.sprites.filter((shouldRemove) =>
      shouldRemove(timestamp)
    );

    const d = timestamp - this.lastTimestamp;
    if (
      this.lastTimestamp === null ||
      d >=
        (this.delta + math.random(-this.randomiseRate, this.randomiseRate)) *
          this.rate
    ) {
      this.emitSprite(timestamp);
      this.lastTimestamp = timestamp;
    }
  }
}

export { SpriteEmitter };
