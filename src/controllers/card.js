import Card from '@components/card.js';
import Popup from '@components/popup.js';

import {render, replace, RenderPosition} from '@src/utils/render.js';

export default class CardController {
  constructor(contrainer) {
    this._container = contrainer;

    this._cardComponent = null;
    this._popupComponent = null;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  render(card) {
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

    render(this._container, this._cardComponent, RenderPosition.BEFOREEND);
  }

  _openPopup() {
    const footer = document.querySelector(`.footer`);
    footer.innerHTML = ``;

    render(footer, this._popupComponent, RenderPosition.BEFOREEND);
  }

  _closePopup() {
    const footer = document.querySelector(`.footer`);
    footer.innerHTML = ``;
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      this._closePopup();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }
}

// const renderCard = function (container, data) {
// const card = new Card(data);
// const popup = new Popup(data);

// const openPopup = () => {
//   const footer = document.querySelector(`.footer`);
//   footer.innerHTML = ``;

//   render(footer, popup, RenderPosition.BEFOREEND);
// };

// const closePopup = () => {
//   const footer = document.querySelector(`.footer`);
//   footer.innerHTML = ``;
// };

// const onEscKeyDown = (evt) => {
//   const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

//   if (isEscKey) {
//     closePopup();
//     document.removeEventListener(`keydown`, onEscKeyDown);
//   }
// };

// card.setClickPopupHandler(() => {
//   openPopup();
//   document.addEventListener(`keydown`, onEscKeyDown);
// });

// popup.setClickPopupHandler(()=>{
//   closePopup();
//   document.removeEventListener(`keydown`, onEscKeyDown);
// });

//   render(container, card, RenderPosition.BEFOREEND);
// };
