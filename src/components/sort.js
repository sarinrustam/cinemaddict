import {render} from '@components/utils.js';

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

const currentSort = sorted[0].value;

const renderSort = function (container) {
  const createTemplate = () => {
    return (
      `<ul class="sort">
      ${sorted.map((item) => `<li><a href="#" class="sort__button ${currentSort === item.value ? `sort__button--active` : ``}">${item.title}</a></li>`).join(``)}
    </ul>`
    );
  };
  render(container, createTemplate(), `beforeEnd`);
};

export {renderSort, currentSort, SORT_DATE, SORT_DEFAULT, SORT_RATING};

