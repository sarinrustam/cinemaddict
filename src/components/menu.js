import AbstractComponent from '@components/abstract-component.js';

export const MenuType = {
  ALL_MOVIES: `all-movies`,
  WATCHLIST: `watchlist`,
  HISTORY: `history`,
  FAVORITES: `favorites`,
};

const getMenuTypeCount = (data, type) => {
  return data.filter((it) => {
    return type === it.type;
  }).length;
};

const createTemplate = (data) => {
  return (
    `<nav class="main-navigation">
      <div class="main-navigation__items">
        <a href="#all" data-menu-type=${MenuType.ALL_MOVIES} class="main-navigation__item main-navigation__item--active">All movies</a>
        <a href="#watchlist" data-menu-type=${MenuType.WATCHLIST} class="main-navigation__item">Watchlist <span class="main-navigation__item-count">${getMenuTypeCount(data, MenuType.WATCHLIST)}</span></a>
        <a href="#history" data-menu-type=${MenuType.HISTORY} class="main-navigation__item">History <span class="main-navigation__item-count">${getMenuTypeCount(data, MenuType.HISTORY)}</span></a>
        <a href="#favorites" data-menu-type=${MenuType.FAVORITES} class="main-navigation__item">Favorites <span class="main-navigation__item-count">${getMenuTypeCount(data, MenuType.FAVORITES)}</span></a>
      </div>
      <a href="#stats" class="main-navigation__additional">Stats</a>
    </nav>`
  );
};

export default class Menu extends AbstractComponent {
  constructor(data) {
    super();

    this._data = data;
    this._currentMenuType = MenuType.ALL_MOVIES;
  }

  getTemplate() {
    return createTemplate(this._data);
  }

  getMenuType() {
    return this._currentMenuType;
  }

  setMenuTypeChangeHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();

      if (evt.target.tagName === !`A`) {
        return;
      }

      const menuType = evt.target.dataset.menuType;

      if (this._currentMenuType === menuType) {
        return;
      }

      this._currentMenuType = menuType;
      handler(this._currentMenuType);
    });
  }
}
