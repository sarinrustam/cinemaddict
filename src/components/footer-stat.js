import AbstractComponent from '@components/abstract-component.js';

const createTemplate = (data) => {
  return (
    `<section class="footer__statistics">
      <p>${data} movies inside</p>
    </section>`
  );
};

export default class FooterStat extends AbstractComponent {
  constructor(data) {
    super();

    this._data = data;
  }

  getTemplate() {
    return createTemplate(this._data);
  }
}
