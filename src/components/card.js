import AbstractComponent from '@components/abstract-component.js';

const createTemplate = (data) => {
  const cardMarkup = `<h3 class="film-card__title">${data.name}</h3>
  <p class="film-card__rating">${data.rating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${data.date.getFullYear()}</span>
  <span class="film-card__duration">${data.duration}</span>
  <span class="film-card__genre">${data.gernes[0]}</span>
      </p>
      <img src="./images/posters/${data.poster}" alt="" class="film-card__poster">
  <p class="film-card__description">${data.description}</p>
  <a class="film-card__comments">${data.comments.length} comments</a>
      <form class="film-card__controls">
        <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist">Add to watchlist</button>
        <button class="film-card__controls-item button film-card__controls-item--mark-as-watched">Mark as watched</button>
        <button class="film-card__controls-item button film-card__controls-item--favorite">Mark as favorite</button>
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
}
