const roundToNearest = (toNearest, original, round = Math.round) => {
  return round(original / toNearest) * toNearest;
};

const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export { roundToNearest, sleep };
