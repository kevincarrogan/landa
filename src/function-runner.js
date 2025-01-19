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
      try {
        await this.functions[functionName](parameters);
      } catch (error) {
        console.log(functionName, parameters);
        console.error(error);
        this.emit("call:error", index);
        this.emit("run:end");
        return;
      }
      this.emit("call:end", index);
      index++;
    }
    this.emit("run:end");
  }
}

export { FunctionRunner };
