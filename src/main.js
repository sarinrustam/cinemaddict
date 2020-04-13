
import {renderRank} from '@components/rank.js';
import {renderMenu, currentFilter, FILTER_ALL} from '@components/menu.js';
import {renderSort} from '@components/sort.js';
import {renderBoard} from '@components/filmsBoard.js';
import {renderFilmCards} from '@components/filmCards.js';
import {renderButton} from '@components/moreButton.js';
import {renderExtraBoard} from '@components/extra.js';
import {renderPopup} from '@components/popup.js';
import {getFilmsData} from '@components/mock/card.js';

// render functions

const init = function () {
  const COUNT_EXTRA_CARD = 2;

  const filmsData = getFilmsData();
  const filmsDataFiltered = filmsData.filter((it) => {
    if (currentFilter === FILTER_ALL) {
      return true;
    }

    return currentFilter === it.type;
  });

  const main = document.querySelector(`.main`);
  const header = document.querySelector(`.header`);

  renderRank(header);
  renderMenu(main, filmsData);
  renderSort(main);
  renderBoard(main);

  const filmsList = main.querySelector(`.films-list`);
  const filmsElement = main.querySelector(`.films`);
  const filmsListContainer = filmsList.querySelector(`.films-list__container`);

  renderFilmCards(filmsListContainer, filmsDataFiltered);
  renderButton(filmsList);
  renderExtraBoard(filmsElement);

  const filmsListExtra = filmsElement.querySelectorAll(`.films-list--extra`);
  const topRatedContainer = filmsListExtra[0].querySelector(`.films-list__container`);
  const mostCommentsContainer = filmsListExtra[1].querySelector(`.films-list__container`);

  const filmsTopRatedData = filmsData.sort((a, b) => b.rating - a.rating).slice(0, COUNT_EXTRA_CARD);
  const filmsMostCommentedData = filmsData.sort((a, b) => b.comments.length - a.comments.length).slice(0, COUNT_EXTRA_CARD);

  renderFilmCards(topRatedContainer, filmsTopRatedData);
  renderFilmCards(mostCommentsContainer, filmsMostCommentedData);

  // renderPopup(filmsData[0]);
};

init();
