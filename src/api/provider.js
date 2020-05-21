import Card from '@src/models/card.js';
import {nanoid} from 'nanoid';

const isOnline = () => {
  return window.navigator.onLine;
};

const getSyncedTasks = (items) => {
  return items.filter(({success}) => success)
    .map(({payload}) => payload.task);
};

const createStoreStructure = (items) => {
  return items.reduce((acc, current) => {
    return Object.assign({}, acc, {
      [current.id]: current,
    });
  }, {});
};

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
  }

  getMovies() {
    if (isOnline()) {
      return this._api.getMovies()
        .then((cards) => {
          const items = createStoreStructure(cards.map((card) => card.toRAW()));

          this._store.setItems(items);

          return cards;
        });
    }

    const storeTasks = Object.values(this._store.getItems());

    return Promise.resolve(Card.parseTasks(storeTasks));
  }

  createMovie(movie) {
    if (isOnline()) {
      return this._api.createMovie(movie)
        .then((newMovie) => {
          this._store.setItem(newMovie.id, newMovie.toRAW());

          return newMovie;
        });
    }

    // На случай локального создания данных мы должны сами создать `id`.
    // Иначе наша модель будет не полной и это может привнести баги.
    const localNewMovieId = nanoid();
    const localNewMovie = Card.clone(Object.assign(movie, {id: localNewMovieId}));

    this._store.setItem(localNewMovie.id, localNewMovie.toRAW());

    return Promise.resolve(localNewMovie);
  }

  updateMovie(id, movie) {
    if (isOnline()) {
      return this._api.updateMovie(id, movie)
        .then((newMovie) => {
          this._store.setItem(newMovie.id, newMovie.toRAW());

          return newMovie;
        });
    }

    const locaMovie = Card.clone(Object.assign(movie, {id}));

    this._store.setItem(id, locaMovie.toRAW());

    return Promise.resolve(locaMovie);
  }

  deleteMovie(id) {
    if (isOnline()) {
      return this._api.deleteMovie(id)
        .then(() => this._store.removeItem(id));
    }

    this._store.removeItem(id);

    return Promise.resolve();
  }

  sync() {
    if (isOnline()) {
      const storeTasks = Object.values(this._store.getItems());

      return this._api.sync(storeTasks)
        .then((response) => {
          // Забираем из ответа синхронизированные задачи
          const createdTasks = getSyncedTasks(response.created);
          const updatedTasks = getSyncedTasks(response.updated);

          // Добавляем синхронизированные задачи в хранилище.
          // Хранилище должно быть актуальным в любой момент.
          const items = createStoreStructure([...createdTasks, ...updatedTasks]);

          this._store.setItems(items);
        });
    }

    return Promise.reject(new Error(`Sync data failed`));
  }
}
