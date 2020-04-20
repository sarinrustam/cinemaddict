export const Buttons = {
  LMB: 0,
  ENT: `Enter`,
  ESC: `Escape`,
};

export const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`
};

export const render = function (container, element, place) {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;

    case RenderPosition.BEFOREEND:
      container.append(element);
      break;
  }
};

export const createElement = (template) => {
  const element = document.createElement(`div`);

  element.innerHTML = template;

  return element.firstChild;
};

export const getRandomNumber = function (from, to) {
  let number = from + Math.random() * (to + 1 - from);
  return Math.floor(number);
};

export const getRandomElement = function (array) {
  return array[getRandomNumber(0, array.length - 1)];
};

