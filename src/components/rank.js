import AbstractComponent from '@components/abstract-smart-component.js';
import {Ranks} from '@src/utils/common.js';

export const getRank = (data) => {
  const watchedMovieCount = data.filter((it) => it.isWatched).length;

  if (watchedMovieCount === 0) {
    return ``;
  }

  if (watchedMovieCount <= 10) {
    return Ranks.NOVICE;
  }

  if (watchedMovieCount <= 20) {
    return Ranks.FAN;
  }

  return Ranks.MOVIE_BUFF;
};

const createTemplate = (data) => {
  return (
    `<section class="header__profile profile">
    <p class="profile__rating">${getRank(data)}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`
  );
};

export default class Rank extends AbstractComponent {
  constructor(cardsModel) {
    super();

    this._cardsModel = cardsModel;

    this._onDataChange = this._onDataChange.bind(this);

    this._cardsModel.setDataChangeHandler(this._onDataChange);
  }

  getTemplate() {
    return createTemplate(this._cardsModel.getCardsAll());
  }

  rerender() {
    const oldElement = this.getElement();
    const parent = oldElement.parentElement;

    this.removeElement();

    const newElement = this.getElement();

    parent.replaceChild(newElement, oldElement);
  }

  _onDataChange() {
    this.rerender();
  }
}
