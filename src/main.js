
import {renderRank} from '@components/rank.js';
import {renderMenu, currentFilter, FILTER_ALL} from '@components/menu.js';
import {renderSort, currentSort, SORT_DATE, SORT_DEFAULT, SORT_RATING} from '@components/sort.js';
import {renderBoard} from '@components/filmsBoard.js';
import {renderFilmCards, renderMainFilmCards} from '@components/filmCards.js';
import {renderButton, initMoreButton} from '@components/moreButton.js';
import {renderExtraBoard} from '@components/extra.js';
import {renderPopup} from '@components/popup.js';
import {getFilmsData} from '@components/mock/card.js';

const init = function () {
  const COUNT_EXTRA_CARD = 2;

  const filmsData = getFilmsData();
  const filmsDataFiltered = filmsData.filter((it) => {
    if (currentFilter === FILTER_ALL) {
      return true;
    }

    return currentFilter === it.type;
  });

  const getFilmsDataSorted = function (data) {
    if (currentSort === SORT_DEFAULT) {
      return data;
    }
    if (currentSort === SORT_RATING) {
      return data.sort((a, b) => b.rating - a.rating);
    }
    if (currentSort === SORT_DATE) {
      return data.sort((a, b) => b.date - a.date);
    }

    return [];
  };

  const main = document.querySelector(`.main`);
  const header = document.querySelector(`.header`);

  renderRank(header);
  renderMenu(main, filmsData);
  renderSort(main);
  renderBoard(main);

  const filmsList = main.querySelector(`.films-list`);
  const filmsElement = main.querySelector(`.films`);
  const filmsListContainer = filmsList.querySelector(`.films-list__container`);

  renderMainFilmCards(filmsListContainer, getFilmsDataSorted(filmsDataFiltered));
  renderButton(filmsList);
  renderExtraBoard(filmsElement);

  initMoreButton();

  const filmsListExtra = filmsElement.querySelectorAll(`.films-list--extra`);
  const topRatedContainer = filmsListExtra[0].querySelector(`.films-list__container`);
  const mostCommentsContainer = filmsListExtra[1].querySelector(`.films-list__container`);

  const filmsTopRatedData = filmsData.sort((a, b) => b.rating - a.rating).slice(0, COUNT_EXTRA_CARD);
  const filmsMostCommentedData = filmsData.sort((a, b) => b.comments.length - a.comments.length).slice(0, COUNT_EXTRA_CARD);

  renderFilmCards(topRatedContainer, filmsTopRatedData);
  renderFilmCards(mostCommentsContainer, filmsMostCommentedData);

  renderPopup(filmsData[0]);
};

init();
