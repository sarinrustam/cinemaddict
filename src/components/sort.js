import AbstractComponent from '@components/abstract-component.js';

export const SortType = {
  SORT_RATING: `rating`,
  SORT_DATE: `date-up`,
  DEFAULT: `default`,
};

const createTemplate = () => {
  return (
    `<ul class="sort">
      <li><a href="#" data-sort-type=${SortType.DEFAULT} class="sort__button">Sort by default</a></li>
      <li><a href="#" data-sort-type=${SortType.SORT_DATE} class="sort__button">Sort by date</a></li>
      <li><a href="#" data-sort-type=${SortType.SORT_RATING} class="sort__button">Sort by rating</a></li>
    </ul>`
  );
};

export default class Sort extends AbstractComponent {
  constructor() {
    super();

    this._currentSortType = SortType.DEFAULT;
  }

  getTemplate() {
    return createTemplate();
  }

  getSortType() {
    return this._currentSortType;
  }

  reset() {
    const prevActiveElement = this.getElement().querySelector(`.sort__button--active`);

    if (prevActiveElement) {
      prevActiveElement.classList.remove(`sort__button--active`);
    }

    this._currentSortType = SortType.DEFAULT;
  }

  setSortTypeChangeHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();

      if (evt.target.tagName !== `A` && evt.target.tagName !== `LI`) {
        return;
      }

      const sortType = evt.target.dataset.sortType;

      if (this._currentSortType === sortType) {
        return;
      }

      const prevActiveElement = this.getElement().querySelector(`.sort__button--active`);

      if (prevActiveElement) {
        prevActiveElement.classList.remove(`sort__button--active`);
      }

      if (evt.target.tagName === `LI`) {
        evt.target.firstElementChild.classList.add(`sort__button--active`);
      } else {
        evt.target.classList.add(`sort__button--active`);
      }

      this._currentSortType = sortType;
      handler(this._currentSortType);
    });
  }
}
