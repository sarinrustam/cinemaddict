import Rank from '@components/rank.js';
import Menu from '@components/menu.js';
import Sort from '@components/sort.js';
import Board from '@components/filmsBoard.js';
import FilmCards from '@components/filmCards.js';
import FilmCardsExtra from '@components/extra.js';
import {getFilmsData} from '@components/mock/card.js';
import {RenderPosition, render} from '@components/utils.js';


const init = function () {
  const COUNT_EXTRA_CARD = 2;

  const filmsData = getFilmsData();
  const filmsTopRatedData = filmsData.sort((a, b) => b.rating - a.rating).slice(0, COUNT_EXTRA_CARD);
  const filmsMostCommentedData = filmsData.sort((a, b) => b.comments.length - a.comments.length).slice(0, COUNT_EXTRA_CARD);

  const main = document.querySelector(`.main`);
  const header = document.querySelector(`.header`);

  const rank = new Rank();
  const menu = new Menu(filmsData);
  const sort = new Sort();

  const filmsDataFiltered = filmsData.filter((it) => {
    if (menu.active === menu.FILTER_ALL) {
      return true;
    }

    return menu.active === it.type;
  });

  const getFilmsDataSorted = function (data) {
    if (sort.active === sort.DEFAULT) {
      return data;
    }
    if (sort.active === sort.RATING) {
      return data.sort((a, b) => b.rating - a.rating);
    }
    if (sort.active === sort.DATE) {
      return data.sort((a, b) => b.date - a.date);
    }

    return [];
  };

  const board = new Board();
  const filmCards = new FilmCards(getFilmsDataSorted(filmsDataFiltered));
  const filmsTopRated = new FilmCardsExtra(filmsTopRatedData, `Top Rated`);
  const filmsMostCommented = new FilmCardsExtra(filmsMostCommentedData, `Most Commented`);

  render(header, rank.getElement(), RenderPosition.BEFOREEND);
  render(main, menu.getElement(), RenderPosition.BEFOREEND);
  render(main, sort.getElement(), RenderPosition.BEFOREEND);
  render(main, board.getElement(), RenderPosition.BEFOREEND);

  render(board.getElement(), filmCards.getElement(), RenderPosition.BEFOREEND);
  render(board.getElement(), filmsTopRated.getElement(), RenderPosition.BEFOREEND);
  render(board.getElement(), filmsMostCommented.getElement(), RenderPosition.BEFOREEND);

  filmCards.init();
  filmsTopRated.init();
  filmsMostCommented.init();
};

init();
