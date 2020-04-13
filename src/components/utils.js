const render = (container, template, targetPlace) => {
  container.insertAdjacentHTML(targetPlace, template);
};

const getRandomNumber = function (from, to) {
  let number = from + Math.random() * (to + 1 - from);
  return Math.floor(number);
};

const getRandomElement = function (array) {
  return array[getRandomNumber(0, array.length - 1)];
};

export {render, getRandomNumber, getRandomElement};
