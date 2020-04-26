import AbstractComponent from '@components/abstract-component.js';

const createTemplate = () => {
  return (
    `<h2 class="films-list__title">There are no movies in our database</h2>`
  );
};

export default class Message extends AbstractComponent {
  getTemplate() {
    return createTemplate();
  }
}
