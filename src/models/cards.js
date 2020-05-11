import {getFilterdCards} from '@src/utils/menu.js';
import {MenuType} from '@src/utils/common.js';

export default class CardsModel {
  constructor() {
    this._cards = [];
    this._activeMenuType = MenuType.ALL_MOVIES;

    this._dataChangeHandlers = [];
    this._menuChangeHandlers = [];
  }

  getCards() {
    return getFilterdCards(this._cards, this._activeMenuType);
  }

  getCardsAll() {
    return this._cards;
  }

  setCards(cards) {
    this._cards = Array.from(cards);
    this._callHandlers(this._dataChangeHandlers);
  }

  setMenu(menuType) {
    this._activeMenuType = menuType;
    this._callHandlers(this._menuChangeHandlers);
  }

  removeCard(id) {
    const index = this._cards.findIndex((it) => it.id === id);

    if (index === -1) {
      return false;
    }

    this._cards = [].concat(this._cards.slice(0, index), this._cards.slice(index + 1));

    this._callHandlers(this._dataChangeHandlers);

    return true;
  }

  updateCard(id, card) {
    const index = this._cards.findIndex((it) => it.id === id);

    if (index === -1) {
      return false;
    }

    this._cards = [].concat(this._cards.slice(0, index), card, this._cards.slice(index + 1));

    this._callHandlers(this._dataChangeHandlers);

    return true;
  }

  addCard(card) {
    this._cards = [].concat(card, this._cards);
    this._callHandlers(this._dataChangeHandlers);
  }

  setDataChangeHandler(handler) {
    this._dataChangeHandlers.push(handler);
  }

  setMenuChangeHandler(handler) {
    this._menuChangeHandlers.push(handler);
  }

  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }
}
