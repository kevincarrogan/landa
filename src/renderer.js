import p5 from "p5";
import { clamp, roundToNearest } from "./utils";

const ROUND_TO = 5;
const BOX_SIZE = 4;

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

  draw(p) {
    p.background(255);
    p.noStroke();
    const cameraBounds = this.getCameraBounds();
    for (const body of this.game.getBodies(cameraBounds)) {
      for (
        let x = roundToNearest(ROUND_TO, cameraBounds.min.x);
        x < cameraBounds.max.x;
        x += ROUND_TO
      ) {
        for (
          let y = roundToNearest(ROUND_TO, cameraBounds.min.y);
          y < cameraBounds.max.y;
          y += ROUND_TO
        ) {
          const point = { x, y };
          if (this.game.contains(body, point)) {
            const val = Math.abs((x % 10) - (y % 10));
            p.fill(clamp(0, 1, val) * 150);
            this.drawPixel(p, {
              x: x - roundToNearest(ROUND_TO, cameraBounds.min.x),
              y: y - roundToNearest(ROUND_TO, cameraBounds.min.y),
            });
          }
        }
      }
    }
  }

  drawPixel = (p, { x, y }) => {
    p.square(x, y, BOX_SIZE);
  };
}

export { Renderer };
