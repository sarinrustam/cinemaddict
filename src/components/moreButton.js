import {render} from '@components/utils.js';

const renderButton = function (container) {
  const createTemplate = () => {
    return (
      `<button class="films-list__show-more">Show more</button>`
    );
  };
  render(container, createTemplate(), `beforeEnd`);
};

export {renderButton};
