import {createElement} from '@components/utils.js';

const SORT_DEFAULT = `default`;
const SORT_DATE = `date`;
const SORT_RATING = `rating`;

const sorted = [
  {
    title: `Sort by default`,
    value: SORT_DEFAULT,
  },
  {
    title: `Sort by date`,
    value: SORT_DATE,
  },
  {
    title: `Sort by rating`,
    value: SORT_RATING,
  }
];

const createTemplate = () => {
  const getSortList = sorted.map((item) => `<li><a href="#" class="sort__button">${item.title}</a></li>`).join(``);

  return (
    `<ul class="sort">
    ${getSortList}
  </ul>`
  );
};

export default class Sort {
  constructor(data) {
    this._element = null;
    this._data = data;
    this.active = sorted[0].value;
    this.DATE = SORT_DATE;
    this.DEFAULT = SORT_DEFAULT;
    this.RATING = SORT_RATING;
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

  removeElement() {
    this._element = null;
  }
}

// ${currentSort === item.value ? `sort__button--active` : ``}
