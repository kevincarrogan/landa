import { Transformer } from "./parser";

class FunctionTransform extends Transformer {
  start(args) {
    return args;
  }

  line(args) {
    return args[0];
  }

  call([{ value: functionName }, parameters]) {
    return [functionName, parameters];
  }

  parameters(args) {
    let mapped = {};

    for (let [name, value] of args) {
      mapped[name] = value;
    }

    return mapped;
  }

  parameter([{ value: name }, { value: value }]) {
    return [name, value];
  }
}

export { FunctionTransform };
