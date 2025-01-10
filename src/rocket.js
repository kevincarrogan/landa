import { Body } from "matter-js";

class Rocket {
  constructor(body, gravity) {
    this.body = body;
    this.Body = Body;
    this.gravity = gravity;

    this.thrustForce = null;
  }

  setThrust(to) {
    this.thrustForce = to;
  }

  applyThrust() {
    if (this.thrustForce) {
      Body.setVelocity(this.body, { x: 0, y: this.thrustForce });
    }
  }
}

export { Rocket };
