import Card from '@components/card.js';
import CardModel from '@src/models/card.js';
import Popup from '@components/popup.js';

import {render, RenderPosition, remove, replace} from '@src/utils/render.js';
import {Buttons} from '@src/utils/common.js';
import {ButtonTexts} from '@src/components/popup.js';

const SHAKE_ANIMATION_TIMEOUT = 600;

export const Mode = {
  DEFAULT: `default`,
  IS_OPEN: `open`,
};

const Types = {
  WATCHLIST: `isInWatchlist`,
  WATCHED: `isWatched`,
  FAVORITE: `isFavorite`,
};

const cardKeyChange = (controller, card, key) =>{
  const newCard = CardModel.clone(card);
  newCard[key] = !newCard[key];

  controller._onDataChange(controller, card, newCard);
};

export default class CardController {
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

  render(card, comments, mode) {
    const oldCardComponent = this._cardComponent;
    const oldPopupComponent = this._popupComponent;

    this._cardComponent = new Card(card);
    this._popupComponent = new Popup(card, comments);

    if (oldCardComponent && oldPopupComponent) {
      replace(this._cardComponent, oldCardComponent);
      replace(this._popupComponent, oldPopupComponent);
    } else {
      render(this._container, this._cardComponent, RenderPosition.BEFOREEND);
    }

    if (mode === Mode.IS_OPEN) {
      this._openPopup();
      this._popupComponent.getElement().scrollTop = this._scrollTopPopup;
    }

    this._cardComponent.setClickPopupHandler(() => {
      this._openPopup();
      document.addEventListener(`keydown`, this._onEscKeyDown);
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
      document.removeEventListener(`keydown`, this._onEscKeyDown);
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

      this._onChangeComments(this, card, newCard, id, null);
    });

    this._popupComponent.setSubmitHandler((evt) => {
      if (evt.key === Buttons.ENT && evt.ctrlKey && !this.formIsDisabled) {
        this.disableForm(true);

        const comment = this._popupComponent.getNewComment();
        this._scrollTopPopup = this._popupComponent.getElement().scrollTop;

        this._onChangeComments(this, card, null, null, comment);
      }
    });

    this._popupComponent.setControlWatchlistHandler(() => {
      cardKeyChange(this, card, Types.WATCHLIST);
    });

    this._popupComponent.setControlWatchedHandler(() => {
      cardKeyChange(this, card, Types.WATCHED);
    });

    this._popupComponent.setControlFavoriteHandler(() => {
      cardKeyChange(this, card, Types.FAVORITE);
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
  }

  _closePopup() {
    this._mode = Mode.DEFAULT;
    remove(this._popupComponent);
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      this._closePopup();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }

  shakeComment(id) {
    const comment = this._popupComponent.getElement().querySelector(`[data-id="${id}"]`);
    const deleteButton = comment.querySelector(`.film-details__comment-delete`);
    deleteButton.disabled = false;
    deleteButton.innerText = ButtonTexts.DELETE;

    comment.style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;

    setTimeout(() => {
      comment.style.animation = ``;
    }, SHAKE_ANIMATION_TIMEOUT);
  }

  shakeForm() {
    const form = this._popupComponent.getElement().querySelector(`.film-details__inner`);
    form.style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;
    this.formIsDisabled = true;

    setTimeout(() => {
      form.style.animation = ``;
    }, SHAKE_ANIMATION_TIMEOUT);
  }

  disableForm(value) {
    this.formIsDisabled = value;
    const input = this._popupComponent.getElement().querySelector(`.film-details__comment-input`);
    const radioInputs = Array.from(this._popupComponent.getElement().querySelectorAll(`.film-details__emoji-item`));

    input.disabled = value;

    radioInputs.forEach((it) => {
      it.disabled = value;
    });
  }
}
