import Card from '@components/card.js';
import Popup from '@components/popup.js';

import {render, RenderPosition, replace} from '@src/utils/render.js';

const Mode = {
  DEFAULT: `default`,
  IS_OPEN: `open`,
};

export default class CardController {
  constructor(contrainer, onDataChange, onViewChange) {
    this._container = contrainer;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._mode = Mode.DEFAULT;

    this._cardComponent = null;
    this._popupComponent = null;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  render(card) {
    const oldCardComponent = this._cardComponent;
    const oldPopupComponent = this._popupComponent;

    this._cardComponent = new Card(card);
    this._popupComponent = new Popup(card);

    this._cardComponent.setClickPopupHandler(() => {
      this._openPopup();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._popupComponent.setClickPopupHandler(() => {
      this._closePopup();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    });

    this._cardComponent.setAddToWatchlistHandler((evt) => {
      evt.preventDefault();

      this._onDataChange(this, card, Object.assign({}, card, {
        isInWatchlist: !card.isInWatchlist,
      }));
    });

    this._cardComponent.setMarkAsWatchedHandler((evt) => {
      evt.preventDefault();

      this._onDataChange(this, card, Object.assign({}, card, {
        isWatched: !card.isWatched,
      }));
    });

    this._cardComponent.setMarkAsFavoriteHandler((evt) => {
      evt.preventDefault();

      this._onDataChange(this, card, Object.assign({}, card, {
        isFavorite: !card.isFavorite,
      }));
    });

    // render(this._container, this._cardComponent, RenderPosition.BEFOREEND);
    if (oldCardComponent && oldPopupComponent) {
      replace(this._cardComponent, oldCardComponent);
      replace(this._popupComponent, oldPopupComponent);
    } else {
      render(this._container, this._cardComponent, RenderPosition.BEFOREEND);
    }
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._closePopup();
    }
  }

  _openPopup() {
    this._onViewChange();
    const footer = document.querySelector(`.footer`);
    footer.innerHTML = ``;

    render(footer, this._popupComponent, RenderPosition.BEFOREEND);
    this._mode = Mode.IS_OPEN;
  }

  _closePopup() {
    const footer = document.querySelector(`.footer`);
    footer.innerHTML = ``;
    this._mode = Mode.DEFAULT;
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      this._closePopup();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }
}
