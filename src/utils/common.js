export const Buttons = {
  LMB: 0,
  ENT: `Enter`,
  ESC: `Escape`,
};

export const getRandomNumber = function (from, to) {
  let number = from + Math.random() * (to + 1 - from);
  return Math.floor(number);
};

export const getRandomElement = function (array) {
  return array[getRandomNumber(0, array.length - 1)];
};
