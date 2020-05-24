import Card from '@src/models/card.js';
import Comment from '@src/models/comment.js';

export const isOnline = () => {
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
  constructor(api, storeCards, storeComments) {
    this._api = api;
    this._storeCards = storeCards;
    this._storeComments = storeComments;
  }

  getMovies() {
    if (isOnline()) {
      return this._api.getMovies()
        .then((cards) => {
          const items = createStoreStructure(cards.map((card) => card.toRAW()));

          this._storeCards.setItems(items);

          return cards;
        });
    }

    const storeCards = Object.values(this._storeCards.getItems());

    return Promise.resolve(Card.parseMovies(storeCards));
  }

  updateMovie(id, movie) {
    if (isOnline()) {
      return this._api.updateMovie(id, movie)
        .then((newMovie) => {
          this._storeCards.setItem(newMovie.id, newMovie.toRAW());

          return newMovie;
        });
    }

    const locaMovie = Card.clone(Object.assign(movie, {id}));

    this._storeCards.setItem(id, locaMovie.toRAW());

    return Promise.resolve(locaMovie);
  }

  getComment(id) {
    if (isOnline()) {
      return this._api.getComment(id)
        .then((comments) => {
          const items = createStoreStructure(comments.map((comment) => {
            return comment.toRAW();
          }));

          for (const key in items) {
            if (items.hasOwnProperty(key)) {
              this._storeComments.setItem(key, items[key]);
            }
          }

          return comments;
        });
    }

    const storeTasks = Object.values(this._storeComments.getItems());

    return Promise.resolve(Comment.parseComments(storeTasks));
  }

  createComment(id, comment) {
    return this._api.createComment(id, comment)
      .then(({comments, movie}) => {
        this._storeCards.setItem(id, movie.toRAW());
        const items = createStoreStructure(comments.map((it) => {
          return it.toRAW();
        }));

        for (const key in items) {
          if (items.hasOwnProperty(key)) {
            this._storeComments.setItem(key, items[key]);
          }
        }

        return {comments, movie};
      });
  }

  deleteComment(id) {
    return this._api.deleteComment(id)
      .then(() => this._storeComments.removeItem(id));
  }

  sync() {
    if (isOnline()) {
      const storeTasks = Object.values(this._storeCards.getItems());

      return this._api.sync(storeTasks)
        .then((response) => {
          // Забираем из ответа синхронизированные задачи
          const createdTasks = getSyncedTasks(response.created);
          const updatedTasks = getSyncedTasks(response.updated);

          // Добавляем синхронизированные задачи в хранилище.
          // Хранилище должно быть актуальным в любой момент.
          const items = createStoreStructure([...createdTasks, ...updatedTasks]);

          this.this._storeCards.setItems(items);
        });
    }

    return Promise.reject(new Error(`Sync data failed`));
  }
}
