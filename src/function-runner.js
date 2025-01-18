import { EventEmitter } from "events";

class FunctionRunner extends EventEmitter {
  constructor(functions) {
    super();
    this.functions = functions;
  }

  async run(functionCalls) {
    this.emit("run:start");
    let index = 1;
    for (const [functionName, parameters] of functionCalls) {
      this.emit("call:start", index);
      await this.functions[functionName](parameters);
      this.emit("call:end", index);
      index++;
    }
    this.emit("run:end");
  }
}

export { FunctionRunner };
