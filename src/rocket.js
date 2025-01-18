import Matter from "matter-js";

class Rocket {
  constructor(body) {
    this.body = body;

    this.speed = null;
  }

  setThrust(to) {
    this.speed = to;
  }

  applyThrust() {
    if (!this.speed) {
      return;
    }

    const angle = this.body.angle;

    const newVelocity = Matter.Vector.create(
      this.speed * Math.sin(angle),
      -this.speed * Math.cos(angle)
    );

    Matter.Body.setVelocity(this.body, newVelocity);
  }

  rotate(by) {
    Matter.Body.setAngle(this.body, by);
  }
}

export { Rocket };
