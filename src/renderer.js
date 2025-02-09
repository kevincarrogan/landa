import p5 from "p5";
import { roundToNearest } from "./utils";

const MARGIN = 1;
const BOX_SIZE = 3;
const ROUND_TO = BOX_SIZE + MARGIN;

class Renderer {
  constructor(game, $el, width, height) {
    this.game = game;
    this.$el = $el;
    this.width = width;
    this.height = height;

    this.init();
  }

  init() {
    const setup = (p) => {
      p.setup = () => this.setup(p);
      p.draw = () => this.draw(p);
    };
    new p5(setup);
  }

  setup(p) {
    p.createCanvas(this.width, this.height, this.$el);
  }

  getCameraBounds() {
    const position = this.game.rocket.getPosition();
    const min = {
      x: position.x - this.width / 2,
      y: position.y - this.height / 2,
    };
    const max = {
      x: min.x + this.width,
      y: min.y + this.height,
    };

    return { min, max };
  }

  translatePoint(bounds, { x, y }) {
    return {
      x:
        roundToNearest(ROUND_TO, x, Math.floor) -
        roundToNearest(ROUND_TO, bounds.min.x, Math.floor),
      y:
        roundToNearest(ROUND_TO, y, Math.floor) -
        roundToNearest(ROUND_TO, bounds.min.y, Math.floor),
    };
  }

  draw(p) {
    p.background(255);
    p.noStroke();
    const cameraBounds = this.getCameraBounds();
    this.renderBodies(p, cameraBounds);
    this.renderSprites(p, cameraBounds);
  }

  renderBodies(p, cameraBounds) {
    const bodies = this.game.getBodies(cameraBounds);
    for (const body of bodies) {
      for (let x = cameraBounds.min.x; x <= cameraBounds.max.x; x += ROUND_TO) {
        for (
          let y = cameraBounds.min.y;
          y <= cameraBounds.max.y;
          y += ROUND_TO
        ) {
          const point = { x, y };
          if (this.game.contains(body, point)) {
            const translatedPoint = this.translatePoint(cameraBounds, point);
            p.fill(0);
            this.drawPixel(p, translatedPoint);
          }
        }
      }
    }
  }

  renderSprites(p, cameraBounds) {
    const sprites = this.game.getSprites(cameraBounds);
    for (const sprite of sprites) {
      const translatedPoint = this.translatePoint(
        cameraBounds,
        sprite.position
      );
      p.fill(0);
      this.drawPixel(p, translatedPoint);
    }
  }

  drawPixel = (p, { x, y }) => {
    p.square(x, y, BOX_SIZE);
  };
}

export { Renderer };
