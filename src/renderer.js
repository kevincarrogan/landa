import p5 from "p5";
import { roundToNearest } from "./utils";

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

  draw(p) {
    p.background(255);
    p.noStroke();
    for (const body of this.game.getBodies()) {
      for (
        let x = roundToNearest(ROUND_TO, body.bounds.min.x);
        x < body.bounds.max.x;
        x += ROUND_TO
      ) {
        for (
          let y = roundToNearest(ROUND_TO, body.bounds.min.y);
          y < body.bounds.max.y;
          y += ROUND_TO
        ) {
          const point = { x, y };
          if (this.game.contains(body, point)) {
            if (x % 10 === y % 10) {
              p.fill(0);
            } else {
              p.fill(150);
            }
            this.drawPixel(p, point);
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
