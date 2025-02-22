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
      let units = $input.dataset.units;
      const $output = $el.querySelector(`[name=${$input.name}-value]`);
      const setValue = () => {
        const newValue = `${$input.value}${units}`;
        $output.value = newValue;
        const eventName = this.getEventName($input.name);
        let transformedUnits = units;
        if (transformedUnits === "%") {
          transformedUnits = "percent";
        }
        this.emit(eventName, math.unit($input.value, transformedUnits));
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
}

export { Debugger };
