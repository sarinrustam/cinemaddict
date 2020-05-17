import API from '@src/api.js';
import CardsModel from '@src/models/cards.js';
import MainController from '@src/controllers/main.js';
import Rank from '@components/rank.js';
import {RenderPosition, render} from '@src/utils/render.js';

const AUTHORIZATION = `Basic dsijgsd;lf32rl;sdf=`;

const init = function () {
  const api = new API(AUTHORIZATION);
  const cardsModel = new CardsModel();
  // cardsModel.setCards(getFilmsData());

  const main = document.querySelector(`.main`);
  const header = document.querySelector(`.header`);
  const mainController = new MainController(main, cardsModel, api);
  const rank = new Rank();

  render(header, rank, RenderPosition.BEFOREEND);

  api.getMovies()
    .then((movies) => {
      cardsModel.setCards(movies);

      const arrayOfPromises = movies.map((movie) => {
        return api.getComment(movie.id);
      });

      return Promise.all(arrayOfPromises);
    })
    .then((comments) => {
      comments.forEach((it, i) => {
        cardsModel.setComments(i, it);
      });

      mainController.render();
    });
};

init();
