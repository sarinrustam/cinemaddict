import {render} from '@components/utils.js';
import {showMoreCards} from '@components/filmCards.js';

let moreButton;

const renderButton = function (container) {
  const createTemplate = () => {
    return (
      `<button class="films-list__show-more">Show more</button>`
    );
  };
  render(container, createTemplate(), `beforeEnd`);
};

const initMoreButton = () => {
  moreButton = document.querySelector(`.films-list__show-more`);

  moreButton.addEventListener(`click`, () => {
    showMoreCards();
  });
};

const hideMoreButton = function () {
  moreButton.classList.add(`visually-hidden`);
};

export {renderButton, initMoreButton, hideMoreButton};
