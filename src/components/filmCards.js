import {renderCard} from '@components/card.js';
import {hideMoreButton} from '@components/moreButton.js';

const DEFAULT_CARDS = 5;
const SHOW_CLICK_CARDS = 5;
let showingCountCards = 0;
let cardsData;
let cardsContainer;

const renderFilmCards = function (container, data) {
  data.forEach((it) => {
    renderCard(container, it);
  });
};

const renderMainFilmCards = function (container, data) {
  cardsData = data;
  cardsContainer = container;
  showingCountCards = DEFAULT_CARDS;

  cardsData.slice(0, DEFAULT_CARDS).forEach((it) => {
    renderCard(cardsContainer, it);
  });
};

const showMoreCards = () => {
  const prevCardsCount = showingCountCards;
  showingCountCards = showingCountCards + SHOW_CLICK_CARDS;

  cardsData.slice(prevCardsCount, showingCountCards).forEach((it) => {
    renderCard(cardsContainer, it);
  });

  if (showingCountCards >= cardsData.length) {
    hideMoreButton();
  }
};

export {renderFilmCards, showMoreCards, renderMainFilmCards};
