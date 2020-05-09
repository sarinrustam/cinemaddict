import {MenuType} from '@src/utils/common.js';

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
    case MenuType.ALL_MOVIES:
      return cards;
    case MenuType.WATCHLIST:
      return getIsInWatchlistCards(cards);
    case MenuType.HISTORY:
      return getIsWatched(cards);
    case MenuType.FAVORITES:
      return getFavoriteCards(cards);
  }

  return cards;
};
