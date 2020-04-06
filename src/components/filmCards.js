import {renderCard} from '@components/card.js';

const renderFilmCards = function (container, data) {
  data.forEach((it) => {
    renderCard(container, it);
  });
};

export {renderFilmCards};
