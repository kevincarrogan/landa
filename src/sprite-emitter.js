import Matter from "matter-js";
import { all, create } from "mathjs";
import { SPRITE_CATEGORY, STATIC_CATEGORY } from "./collision-categories";

const math = create(all);

class SpriteEmitter {
  constructor(
    x,
    y,
    angle,
    rate,
    delta,
    decay,
    spread,
    spriteComposite
  ) {
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.rate = rate;
    this.delta = delta;
    this.decay = decay;
    this.spread = spread;
    this.lastTimestamp = null;
    this.velocity = Matter.Vector.create(0, 0);

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
    Matter.Composite.add(this.composite, body);
    Matter.Body.setVelocity(body, this.velocity);
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

    if (this.lastTimestamp === null) {
      this.lastTimestamp = timestamp;
    }

    const d = timestamp - this.lastTimestamp;
    if (math.larger(math.unit(d, "ms"), math.divide(1, this.rate).to("ms"))) {
      this.emitSprite(timestamp);
      this.lastTimestamp = timestamp;
    }
  }

  setPosition(position) {
    this.x = position.x;
    this.y = position.y;
  }

  setAngle(angle) {
    this.angle = angle;
  }

  setSpriteDecay(decayTime) {
    this.decay = decayTime;
  }

  setSpriteRate(rate) {
    this.rate = rate;
  }

  setSpriteSpread(spread) {
    this.spread = spread;
  }

  setVelocity(velocity) {
    this.velocity = velocity;
  }
}

export { SpriteEmitter };
