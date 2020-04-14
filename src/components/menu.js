import {render} from '@components/utils.js';

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

const currentFilter = filters[0].value;

const renderMenu = function (container, data) {
  const createTemplate = () => {
    return (
      `<nav class="main-navigation">
      <div class="main-navigation__items">
        ${filters.map((item) => {
        return `<a href="${item.href}" class="main-navigation__item ${currentFilter === item.value ? `main-navigation__item--active` : ``}">${item.title}
        ${item.value === FILTER_ALL ? `` : `<span class="main-navigation__item-count">${data.filter((it) => it.type === item.value).length}</span>`}
        </a>`;
      }).join(``)}
      </div>
      <a href="#stats" class="main-navigation__additional">Stats</a>
    </nav>`
    );
  };
  render(container, createTemplate(), `beforeEnd`);
};

export {renderMenu, currentFilter, FILTER_ALL};
