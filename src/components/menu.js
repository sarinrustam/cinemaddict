import {createElement} from '@components/utils.js';

const filters = [
  {
    title: `All movies`,
    href: `#all`,
    value: `AllMovies`,
  },
  {
    title: `Watchlist`,
    href: `#watchlist`,
    value: `Watchlist`,
  },
  {
    title: `History`,
    href: `#history`,
    value: `History`,
  },
  {
    title: `Favorite`,
    href: `#favorite`,
    value: `Favorite`,
  }
];

const FILTER_ALL = `AllMovies`;

const createTemplate = (data) => {
  const getLinkList = filters.map((item) => {
    return `<a href="${item.href}" class="main-navigation__item">${item.title}
    ${item.value === FILTER_ALL ? `` : `<span class="main-navigation__item-count">${data.filter((it) => it.type === item.value).length}</span>`}
    </a>`;
  }).join(``);

  return (
    `<nav class="main-navigation">
    <div class="main-navigation__items">
      ${getLinkList}
    </div>
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>`
  );
};

export default class Menu {
  constructor(data) {
    this._element = null;
    this._data = data;
    this.active = filters[0].value;
    this.FILTER_ALL = FILTER_ALL;
  }

  getTemplate() {
    return createTemplate(this._data);
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

// ${ === item.value ? `main-navigation__item--active` : ``}
