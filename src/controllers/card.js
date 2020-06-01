import CardComponent from '@components/card.js';
import CardModel from '@src/models/card.js';
import Popup from '@components/popup.js';

import {render, RenderPosition, remove, replace} from '@src/utils/render.js';
import {Buttons} from '@src/utils/common.js';
import {ButtonTexts} from '@src/components/popup.js';

export const Mode = {
  DEFAULT: `default`,
  IS_OPEN: `open`,
};

const Types = {
  WATCHLIST: `isInWatchlist`,
  WATCHED: `isWatched`,
  FAVORITE: `isFavorite`,
};

const cardKeyChange = (controller, card, key, mode, scrollTop) =>{
  const newCard = CardModel.clone(card);
  newCard[key] = !newCard[key];

  if (key === Types.WATCHED && newCard[key]) {
    newCard.watchingDate = new Date();
  }

  controller._onDataChange(controller, card, newCard, mode, scrollTop);
};

export default class Card {
  constructor(contrainer, onDataChange, onChangeComments, onViewChange) {
    this._container = contrainer;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._onChangeComments = onChangeComments;
    this._mode = Mode.DEFAULT;
    this._scrollTopPopup = null;
    this.formIsDisabled = false;

    this._cardComponent = null;
    this._popupComponent = null;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  render(card, comments, mode, scrollTop) {
    const oldCardComponent = this._cardComponent;
    const oldPopupComponent = this._popupComponent;

    this._cardComponent = new CardComponent(card);
    this._popupComponent = new Popup(card, comments);

    if (oldCardComponent && oldPopupComponent) {
      replace(this._cardComponent, oldCardComponent);
      replace(this._popupComponent, oldPopupComponent);
    } else {
      render(this._container, this._cardComponent, RenderPosition.BEFOREEND);
    }

    if (mode === Mode.IS_OPEN) {
      this._openPopup();
      this._popupComponent.getElement().scrollTop = scrollTop;
    }

    this._cardComponent.setClickPopupHandler(() => {
      this._openPopup();
    });

    this._cardComponent.setAddToWatchlistHandler((evt) => {
      evt.preventDefault();

      cardKeyChange(this, card, Types.WATCHLIST);
    });

    this._cardComponent.setMarkAsWatchedHandler((evt) => {
      evt.preventDefault();

      cardKeyChange(this, card, Types.WATCHED);
    });

    this._cardComponent.setMarkAsFavoriteHandler((evt) => {
      evt.preventDefault();

      cardKeyChange(this, card, Types.FAVORITE);
    });

    this._popupComponent.setClickPopupHandler(() => {
      this._closePopup();
    });

    this._popupComponent.setDeleteCommentHandler((evt) => {
      evt.preventDefault();

      evt.target.innerText = ButtonTexts.DELETING;
      evt.target.disabled = true;

      const id = evt.target.closest(`li`).dataset.id;

      const newCard = CardModel.clone(card);
      const index = card.comments.findIndex((it) => it === id);
      newCard.comments = [].concat(card.comments.slice(0, index), card.comments.slice(index + 1));

      this._scrollTopPopup = this._popupComponent.getElement().scrollTop;

      this._onChangeComments(this, card, newCard, id, null, Mode.IS_OPEN, this._popupComponent.getElement().scrollTop);
    });

    this._popupComponent.setSubmitHandler((evt) => {
      if (evt.key === Buttons.ENT && evt.ctrlKey && !this.formIsDisabled) {
        this.disableForm(true);

        const comment = this._popupComponent.getNewComment();
        this._scrollTopPopup = this._popupComponent.getElement().scrollTop;

        this._onChangeComments(this, card, null, null, comment, Mode.IS_OPEN, this._popupComponent.getElement().scrollTop);
      }
    });

    this._popupComponent.setControlWatchlistHandler(() => {
      cardKeyChange(this, card, Types.WATCHLIST, Mode.IS_OPEN, this._popupComponent.getElement().scrollTop);

      this._scrollTopPopup = this._popupComponent.getElement().scrollTop;
    });

    this._popupComponent.setControlWatchedHandler(() => {
      cardKeyChange(this, card, Types.WATCHED, Mode.IS_OPEN, this._popupComponent.getElement().scrollTop);

      this._scrollTopPopup = this._popupComponent.getElement().scrollTop;
    });

    this._popupComponent.setControlFavoriteHandler(() => {
      cardKeyChange(this, card, Types.FAVORITE, Mode.IS_OPEN, this._popupComponent.getElement().scrollTop);

      this._scrollTopPopup = this._popupComponent.getElement().scrollTop;
    });
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._closePopup();
    }
  }

  destroy() {
    remove(this._popupComponent);
    remove(this._cardComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  _openPopup() {
    this._onViewChange();
    const footer = document.querySelector(`.footer`);

    render(footer, this._popupComponent, RenderPosition.BEFOREEND);
    this._popupComponent.reset();
    this._mode = Mode.IS_OPEN;
    document.addEventListener(`keydown`, this._onEscKeyDown);
  }

  _closePopup() {
    this._mode = Mode.DEFAULT;
    remove(this._popupComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      this._closePopup();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }

  shakeComment(id) {
    this._popupComponent.shakeComment(id);
  }

  shakeForm() {
    this._popupComponent.shakeForm();
    this.formIsDisabled = false;
  }

  disableForm(value) {
    this.formIsDisabled = value;

    this._popupComponent.disableForm(value);
  }
}
