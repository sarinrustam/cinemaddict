import {MenuTypes} from '@src/utils/common.js';

export const getFavoriteCards = (cards) => {
  return cards.filter((card) => card.isFavorite);
};

export const getIsInWatchlistCards = (cards) => {
  return cards.filter((card) => card.isInWatchlist);
};

export const getIsWatched = (cards) => {
  return cards.filter((card) => card.isWatched);
};

export const getFilterdCards = (cards, menuType) => {
  switch (menuType) {
    case MenuTypes.ALL_MOVIES:
      return cards;
    case MenuTypes.WATCHLIST:
      return getIsInWatchlistCards(cards);
    case MenuTypes.HISTORY:
      return getIsWatched(cards);
    case MenuTypes.FAVORITES:
      return getFavoriteCards(cards);
  }

  return cards;
};
