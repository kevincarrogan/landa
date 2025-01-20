import Matter from "matter-js";
import {
  create,
  unitDependencies,
} from "mathjs";

const math = create({
  unitDependencies,
});

class Rocket {
  constructor(body, gravity) {
    this.body = body;
    this.gravity = gravity;

    this.speed = null;
    this.desiredAngle = null;
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

  rotateTo(to) {
    this.desiredAngle = to;
  }

  rotateBy(by) {
    this.desiredAngle = this.body.angle + by;
  }

  applyAngle() {
    if (this.desiredAngle && this.body.angle < this.desiredAngle) {
      Matter.Body.setAngle(this.body, this.body.angle + math.unit("5deg").toNumber("rad"));
    }
  }

  getPosition() {
    return this.body.position;
  }
}

export { Rocket };
