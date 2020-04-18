import {createElement, render, RenderPosition} from '@components/utils.js';
import Card from '@components/card.js';


const createTemplate = (title) => {
  return (
    `<section class="films-list--extra">
      <h2 class="films-list__title">${title}</h2>
      <div class="films-list__container"></div>
    </section>`
  );
};

export default class FilmCardsExtra {
  constructor(data, title) {
    this._data = data;
    this._element = null;
    this._container = null;
    this._title = title;
  }

  init() {
    this._container = this._element.querySelector(`.films-list__container`);
    this.renderCards(this._data.slice(0, this._showingCardCount));
  }

  getTemplate() {
    return createTemplate(this._title);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElemenet() {
    this._element = null;
  }

  renderCards(data) {
    data.forEach((it) => {
      const card = new Card(it);

      render(this._container, card.getElement(), RenderPosition.BEFOREEND);
    });
  }
}
