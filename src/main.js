import API from '@src/api/index.js';
import CardsModel from '@src/models/cards.js';
import CommentsModel from '@src/models/comments.js';
import MainController from '@src/controllers/main.js';
import Rank from '@components/rank.js';
import Store from '@src/api/store.js';
import {RenderPosition, render} from '@src/utils/render.js';
import Provider from '@src/api/provider.js';

const AUTHORIZATION = `Basic dsijgsd;lf32rl;sdf=`;
const END_POINT = `https://11.ecmascript.pages.academy/cinemaddict`;
const STORE_PREFIX = `cinemaddict-localstorage`;
const STORE_VER = `v1`;
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;

const init = function () {
  const api = new API(END_POINT, AUTHORIZATION);
  const store = new Store(STORE_NAME, window.localStorage);
  const apiWithProvider = new Provider(api, store);
  const cardsModel = new CardsModel();
  const commentsModel = new CommentsModel();

  const main = document.querySelector(`.main`);
  const header = document.querySelector(`.header`);
  const mainController = new MainController(main, cardsModel, commentsModel, apiWithProvider);
  const rank = new Rank();

  render(header, rank, RenderPosition.BEFOREEND);

  apiWithProvider.getMovies()
    .then((movies) => {
      cardsModel.setCards(movies);

      const arrayOfPromises = movies.map((movie) => {
        return api.getComment(movie.id);
      });

      return Promise.all(arrayOfPromises);
    })
    .then((comments) => {
      commentsModel.setComments(comments);

      mainController.render();
    });

  window.addEventListener(`load`, () => {
    navigator.serviceWorker.register(`/sw.js`)
      .then(() => {
        // Действие, в случае успешной регистрации ServiceWorker
      }).catch(() => {
        // Действие, в случае ошибки при регистрации ServiceWorker
      });
  });

  window.addEventListener(`online`, () => {
    document.title = document.title.replace(` [offline]`, ``);

    apiWithProvider.sync();
  });

  window.addEventListener(`offline`, () => {
    document.title += ` [offline]`;
  });
};

init();
