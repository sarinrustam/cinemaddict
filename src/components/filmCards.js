import Card from '@components/card.js';
import {render, createElement, RenderPosition} from '@components/utils.js';
import MoreButton from '@components/moreButton.js';

const DEFAULT_CARDS = 5;
const SHOW_CLICK_CARDS = 5;

const createTemplate = () => {
  return `<section class="films-list">
  <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
  <div class="films-list__container"></div>
          </section>`;
};

export default class FilmCards {
  constructor(data) {
    this._data = data;
    this._element = null;
    this._showingCardCount = DEFAULT_CARDS;
    this._container = null;
    this._moreButton = null;
  }

  init() {
    this._container = this._element.querySelector(`.films-list__container`);
    this.renderCards(this._data.slice(0, this._showingCardCount));

    this._moreButton = new MoreButton();
    render(this._element, this._moreButton.getElement(), RenderPosition.BEFOREEND);

    this._moreButton._element.addEventListener(`click`, () => {
      this.showMoreCards();
    });
  }

  getTemplate() {
    return createTemplate();
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

  showMoreCards() {
    const prevCardsCount = this._showingCardCount;
    this._showingCardCount = this._showingCardCount + SHOW_CLICK_CARDS;

    this.renderCards(this._data.slice(prevCardsCount, this._showingCardCount));

    if (this._showingCardCount >= this._data.length) {
      this._moreButton.hide();
    }
  }
}
