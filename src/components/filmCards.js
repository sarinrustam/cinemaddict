import Card from '@components/card.js';
import {render, createElement, RenderPosition, Buttons} from '@components/utils.js';
import MoreButton from '@components/moreButton.js';
import Popup from '@components/popup.js';

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
    this._popup = null;
    this._activeCard = null;
    this._footer = null;
  }

  init() {
    this._container = this._element.querySelector(`.films-list__container`);
    this._footer = document.querySelector(`.footer`);
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

      card.poster = card.getElement().querySelector(`.film-card__poster`);
      card.title = card.getElement().querySelector(`.film-card__title`);
      card.comments = card.getElement().querySelector(`.film-card__comments`);

      const clickPopupHandler = () => {
        if (this._popup) {
          this._footer.removeChild(this._popup.getElement());
        }

        this._popup = new Popup(it);
        this._activeCard = card;
        this._popup.escButton = this._popup.getElement().querySelector(`.film-details__close-btn`);

        this._footer.appendChild(this._popup.getElement());

        const popupClose = () => {
          if (this._popup) {
            this._footer.removeChild(this._popup.getElement());

            this._popup = null;
            this._activeCard = null;
          }
        };

        window.addEventListener(`keydown`, (evt) => {
          if (evt.key === Buttons.ESC) {
            popupClose();
          }
        });
        this._popup.escButton.addEventListener(`click`, () => {
          popupClose();
        });

      };

      card.poster.addEventListener(`click`, clickPopupHandler);
      card.title.addEventListener(`click`, clickPopupHandler);
      card.comments.addEventListener(`click`, clickPopupHandler);
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
