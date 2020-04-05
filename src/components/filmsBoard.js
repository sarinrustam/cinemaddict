import {render} from '@components/utils.js';

const renderBoard = function (container) {
  const createTemplate = () => {
    return (
      `<section class="films">
        <section class="films-list">
          <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>

          <div class="films-list__container"></div>
        </section>
      </section>`
    );
  };

  render(container, createTemplate(), `beforeEnd`);
};

export {renderBoard};
