const roundToNearest = (toNearest, original) => {
  return Math.round(original / toNearest) * toNearest;
};

const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export { roundToNearest, sleep };
