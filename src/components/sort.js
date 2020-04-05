import {render} from '@components/utils.js';

const renderSort = function (container) {
  const createTemplate = () => {
    return (
      `<ul class="sort">
      <li><a href="#" class="sort__button sort__button--active">Sort by default</a></li>
      <li><a href="#" class="sort__button">Sort by date</a></li>
      <li><a href="#" class="sort__button">Sort by rating</a></li>
    </ul>`
    );
  };
  render(container, createTemplate(), `beforeEnd`);
};

export {renderSort};

