import Rank from '@components/rank.js';
import MainController from '@src/controllers/main.js';
import {getFilmsData} from '@components/mock/card.js';
import {RenderPosition, render} from '@src/utils/render.js';


const init = function () {
  const filmsData = getFilmsData();

  const main = document.querySelector(`.main`);
  const header = document.querySelector(`.header`);

  const rank = new Rank();
  render(header, rank, RenderPosition.BEFOREEND);

  const mainController = new MainController(main);

  mainController.render(filmsData);
};

init();
