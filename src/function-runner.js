import { EventEmitter } from "events";
import _ from "lodash/lang";
import parseFunc from "reflection-js/parsefunc";

class FunctionRunner extends EventEmitter {
  constructor() {
    super();
    this.functions = [];
  }

  register(func) {
    this.functions.push(func);
  }

  async callFunction(functionName, parameters) {
    for (const f of this.functions) {
      const { name, params } = parseFunc(f);
      if (name !== functionName) {
        continue;
      }
      const normalisedParams = Object.keys(params).map((n) =>
        n.replace(/^_/, "")
      );
      if (!_.isEqual(Object.keys(parameters), normalisedParams)) {
        continue;
      }
      await f.apply(
        f,
        normalisedParams.map((t) => parameters[t])
      );
      return;
    }
    throw new Error(`Function ${functionName} not found`);
  }

  async run(functionCalls) {
    this.emit("run:start");
    let index = 1;
    for (const [functionName, parameters] of functionCalls) {
      this.emit("call:start", index);
      try {
        await this.callFunction(functionName, parameters);
      } catch (error) {
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
