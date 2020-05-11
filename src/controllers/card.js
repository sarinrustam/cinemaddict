import Card from '@components/card.js';
import Popup from '@components/popup.js';

import {render, RenderPosition, remove, replace} from '@src/utils/render.js';
import {Buttons} from '@src/utils/common.js';

export const Mode = {
  DEFAULT: `default`,
  IS_OPEN: `open`,
};

export const EmptyCard = {};

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

    this._popupComponent.setDeleteCommentHandler((evt) => {
      evt.preventDefault();

      const commentElementIndex = evt.target.closest(`li`).dataset.id;

      const comments = card.comments.slice();

      comments.splice(commentElementIndex, 1);

      this._onDataChange(this, card, Object.assign({}, card, {
        comments
      }));
    });

    this._popupComponent.setSubmitHandler((evt) => {
      if (evt.key === Buttons.ENT && evt.ctrlKey) {
        const comment = this._popupComponent.getNewComment();

        this._onDataChange(this, card, Object.assign({}, card, {
          comments: [].concat(card.comments, [comment])
        }));
      }
    });

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

  destroy() {
    remove(this._popupComponent);
    remove(this._cardComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
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
    this._popupComponent.reset();
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      this._closePopup();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }
}
