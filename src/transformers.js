import {
  create,
  createUnitDependencies,
  evaluateDependencies,
  unitDependencies,
} from "mathjs";
import { Transformer } from "./parser";

const math = create({
  createUnitDependencies,
  evaluateDependencies,
  unitDependencies,
});
math.createUnit("percent", "0.01");

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

  parameter([{ value: name }, value]) {
    return [name, value];
  }

  parameter_value([value]) {
    return value;
  }

  INT({ value }) {
    return math.unit(value).toNumber();
  }

  STRING({ value }) {
    return value;
  }

  int_with_unit([val, unit]) {
    return math.unit(val, unit);
  }

  UNIT({ value }) {
    if (value === "%") {
      value = "percent";
    }
    return math.unit(value);
  }
}

export { FunctionTransform };
