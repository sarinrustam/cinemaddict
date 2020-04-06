import {render} from '@components/utils.js';

const renderExtraBoard = function (container) {
  const createTemplate = (title) => {
    return (
      `<section class="films-list--extra">
        <h2 class="films-list__title">${title}</h2>
        <div class="films-list__container"></div>
      </section>`
    );
  };
  render(container, createTemplate(`Top rated`), `beforeEnd`);
  render(container, createTemplate(`Most commented`), `beforeEnd`);
};

export {renderExtraBoard};
