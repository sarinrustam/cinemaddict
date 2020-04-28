import AbstractComponent from '@components/abstract-component.js';

const createTemplate = () => {
  return `<section class="films-list">
  <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
  <div class="films-list__container"></div>
          </section>`;
};

export default class FilmCards extends AbstractComponent {
  constructor(data) {
    super();

    this._data = data;
  }

  getTemplate() {
    return createTemplate();
  }
}
