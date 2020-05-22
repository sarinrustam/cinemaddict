import API from '@src/api/index.js';
import CardsModel from '@src/models/cards.js';
import CommentsModel from '@src/models/comments.js';
import MainController from '@src/controllers/main.js';
import Rank from '@components/rank.js';
import Store from '@src/api/store.js';
import StatFooter from '@components/footer-stat.js';
import {RenderPosition, render} from '@src/utils/render.js';
import Provider from '@src/api/provider.js';

const AUTHORIZATION = `Basic dsijgsd;lf32rl;sdf=`;
const END_POINT = `https://11.ecmascript.pages.academy/cinemaddict`;
const STORE_PREFIX = `cinemaddict-localstorage`;
const STORE_VER = `v1`;
const STORE_NAME_CARDS = `${STORE_PREFIX}-${STORE_VER}-cards`;
const STORE_NAME_COMMENTS = `${STORE_PREFIX}-${STORE_VER}-comments`;

const init = function () {
  const api = new API(END_POINT, AUTHORIZATION);
  const storeCards = new Store(STORE_NAME_CARDS, window.localStorage);
  const storeComments = new Store(STORE_NAME_COMMENTS, window.localStorage);
  const apiWithProvider = new Provider(api, storeCards, storeComments);
  const cardsModel = new CardsModel();
  const commentsModel = new CommentsModel();

  const main = document.querySelector(`.main`);
  const header = document.querySelector(`.header`);
  const mainController = new MainController(main, cardsModel, commentsModel, apiWithProvider);
  const footer = document.querySelector(`.footer`);

  mainController.renderContainer();

  apiWithProvider.getMovies()
    .then((movies) => {
      cardsModel.setCards(movies);

      const arrayOfPromises = movies.map((movie) => {
        return apiWithProvider.getComment(movie.id);
      });

      return Promise.all(arrayOfPromises);
    })
    .then((comments) => {
      commentsModel.setComments(comments);

      const rank = new Rank(cardsModel);
      const stat = new StatFooter(cardsModel.getCardsAll().length);

      render(header, rank, RenderPosition.BEFOREEND);
      render(footer, stat, RenderPosition.BEFOREEND);
      mainController.renderContent();
    });

  window.addEventListener(`load`, () => {
    navigator.serviceWorker.register(`/sw.js`).catch(() => {});
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
