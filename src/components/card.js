import AbstractComponent from '@components/abstract-component.js';
import {formatTime, formatDateYear} from '@src/utils/common.js';

const MAX_DESC_SYMBOLS = 139;
const ENTRY_POINT_SYMBOLS = 140;

const createButtonMarkup = (name, isActive = true) => {
  return (
    `<button
    class="film-card__controls-item button
    film-card__controls-item--${name.toLowerCase().split(` `).join(`-`)}
    ${isActive ? `` : `film-card__controls-item--disabled`}">
    ${name}
    </button>`
  );
};

const createTemplate = (data) => {
  const addToWatchlist = createButtonMarkup(`add-to-watchlist`, !data.isInWatchlist);
  const markAsWatched = createButtonMarkup(`Mark as watched`, !data.isWatched);
  const markAsFavorite = createButtonMarkup(`Mark as favorite`, !data.isFavorite);

  const time = formatTime(data.duration);
  const year = formatDateYear(data.date);

  const genre = data.genre.length === 0 ? `` : data.genre[0];
  const shortDecription = data.description.length > ENTRY_POINT_SYMBOLS ? data.description.slice(0, MAX_DESC_SYMBOLS) + `...` : data.description;

  const cardMarkup = `<h3 class="film-card__title">${data.name}</h3>
  <p class="film-card__rating">${data.rating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${year}</span>
  <span class="film-card__duration">${time}</span>
  <span class="film-card__genre">${genre}</span>
      </p>
      <img src="${data.poster}" alt="" class="film-card__poster">
  <p class="film-card__description">${shortDecription}</p>
  <a class="film-card__comments">${data.comments.length} comments</a>
      <form class="film-card__controls">
        ${addToWatchlist}
        ${markAsWatched}
        ${markAsFavorite}
      </form>`;

  return (
    `<article class="film-card">
      ${cardMarkup}
    </article>`
  );
};

export default class Card extends AbstractComponent {
  constructor(data) {
    super();

    this._data = data;
  }

  getTemplate() {
    return createTemplate(this._data);
  }

  setClickPopupHandler(handler) {
    const poster = this.getElement().querySelector(`.film-card__poster`);
    const title = this.getElement().querySelector(`.film-card__title`);
    const comments = this.getElement().querySelector(`.film-card__comments`);

    poster.addEventListener(`click`, handler);
    title.addEventListener(`click`, handler);
    comments.addEventListener(`click`, handler);
  }

  setAddToWatchlistHandler(handler) {
    const element = this.getElement().querySelector(`.film-card__controls-item--add-to-watchlist`);

    element.addEventListener(`click`, handler);
  }

  setMarkAsWatchedHandler(handler) {
    const element = this.getElement().querySelector(`.film-card__controls-item--mark-as-watched`);

    element.addEventListener(`click`, handler);
  }

  setMarkAsFavoriteHandler(handler) {
    const element = this.getElement().querySelector(`.film-card__controls-item--mark-as-favorite`);

    element.addEventListener(`click`, handler);
  }
}
