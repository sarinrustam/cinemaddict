import AbstractComponent from '@components/abstract-component.js';

const createTemplate = () => {
  return (
    `<h2 class="films-list__title">Loading…</h2>`
  );
};

export default class Loading extends AbstractComponent {
  getTemplate() {
    return createTemplate();
  }
}
