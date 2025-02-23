import { EventEmitter } from "events";
import {
  create,
  createUnitDependencies,
  evaluateDependencies,
  unitDependencies,
} from "mathjs";
import _ from "lodash/string";

const math = create({
  createUnitDependencies,
  evaluateDependencies,
  unitDependencies,
});
math.createUnit("percent", "0.01");

class Debugger extends EventEmitter {
  constructor($el) {
    super();
    this.$el = $el;
    this.setup($el);
  }

  setup($el) {
    for (const $input of $el.querySelectorAll("input")) {
      const $output = $el.querySelector(`[name=${$input.name}-value]`);
      const setValue = () => {
        const [displayValue, value] = this.getValueWithUnits($input);
        $output.value = displayValue;
        const eventName = this.getEventName($input.name);
        this.emit(eventName, value);
      };
      $input.addEventListener("input", () => {
        setValue();
      });
      setValue();
    }
  }

  show() {
    this.$el.style.display = "flex";
  }

  run() {}

  getEventName(valueName) {
    const normalisedName = _.camelCase(valueName);
    return `change:${normalisedName}`;
  }

  getValueWithUnits($input) {
    const units = $input.dataset.units;
    const displayValue = `${$input.value}${units}`;
    let transformedUnits = units;
    if (transformedUnits === "%") {
      transformedUnits = "percent";
    }
    const value = math.unit($input.value, transformedUnits);

    return [displayValue, value];
  }
}

export { Debugger };
