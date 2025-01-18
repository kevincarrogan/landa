const roundToNearest = (toNearest, original) => {
  return Math.round(original / toNearest) * toNearest;
};

const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const clamp = (min, max, val) => {
  return Math.min(Math.max(val, min), max);
};

export { clamp, roundToNearest, sleep };
