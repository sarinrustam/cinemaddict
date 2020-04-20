import {createElement} from '@components/utils.js';

const createTemplate = (text) => {
  return (
    `<h2 class="films-list__title">${text}</h2>`
  );
};

export default class Message {
  constructor(text) {
    this._element = null;
    this._title = text;
  }

  getTemplate() {
    return createTemplate(this._title);
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
}
