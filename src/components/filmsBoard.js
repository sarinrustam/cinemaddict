import AbstractComponent from '@components/abstract-component.js';

const createTemplate = () => {
  return (
    `<section class="films"></section>`
  );
};

export default class Board extends AbstractComponent {
  getTemplate() {
    return createTemplate();
  }
}
