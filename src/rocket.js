import Matter from "matter-js";

class Rocket {
  constructor(body, gravity) {
    this.body = body;
    this.gravity = gravity;

    this.speed = null;
  }

  setThrust(to) {
    this.speed = to * this.gravity.y * this.gravity.scale * 10;
  }

  applyThrust() {
    if (!this.speed) {
      return;
    }

    const angle = this.body.angle;
    const force = Matter.Vector.create(
      this.speed * Math.sin(angle),
      -this.speed * Math.cos(angle)
    );

    Matter.Body.applyForce(this.body, this.body.position, force);
  }

  rotate(by) {
    Matter.Body.setAngle(this.body, by);
  }
}

export { Rocket };
