import {createElement} from '@components/utils.js';

const createTemplate = () => {
  return (
    `<button class="films-list__show-more">Show more</button>`
  );
};

export default class MoreButton {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createTemplate(this._data);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }

  removeElement() {
    this._element = null;
  }

  hide() {
    this._element.classList.add(`visually-hidden`);
  }
}
