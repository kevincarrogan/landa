import Matter from "matter-js";
import { create, randomDependencies, unitDependencies } from "mathjs";
import { SPRITE_CATEGORY, STATIC_CATEGORY } from "./collision-categories";

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
    const body = Matter.Bodies.rectangle(this.x, this.y, 3, 3, {
      collisionFilter: {
        category: SPRITE_CATEGORY,
        mask: STATIC_CATEGORY,
      },
      restitution: 0.95,
      friction: 0.3,
    });
    const spread = math.unit(math.random(-15, 15), "deg").toNumber("rad");
    const force = Matter.Vector.create(
      0.0001 * Math.sin(spread + Math.PI),
      -0.0001 * Math.cos(spread + Math.PI)
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

  setPosition(position) {
    this.x = position.x;
    this.y = position.y;
  }
}

export { SpriteEmitter };
