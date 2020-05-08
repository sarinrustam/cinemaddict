import Menu, {MenuType} from '@components/menu.js';
import Sort, {SortType} from '@components/sort.js';
import Board from '@components/filmsBoard.js';
import FilmCards from '@components/filmCards.js';
import Message from '@components/message.js';
import MoreButton from '@components/moreButton.js';
import FilmCardsExtra from '@components/extra.js';
import CardController from '@controllers/card.js';
import {render, RenderPosition, remove} from '@src/utils/render.js';

const DEFAULT_CARDS = 5;
const SHOW_CLICK_CARDS = 5;
const COUNT_EXTRA_CARD = 2;

const renderCards = function (container, cards, onDataChange, onViewChange) {
  return cards.map((card) => {
    const cardController = new CardController(container, onDataChange, onViewChange);

    cardController.render(card);

    return cardController;
  });
};

const getFilterdCards = (cards, menuType) => {
  return cards.filter((it) => {
    if (menuType === MenuType.ALL_MOVIES) {
      return true;
    }

    return menuType === it.type;
  });
};

export default class MainController {
  constructor(container, model) {
    this._container = container;
    this._model = model;

    this._showingCardCount = DEFAULT_CARDS;
    this._sortComponent = new Sort();
    this._board = new Board();
    this._message = new Message();
    this._moreButton = new MoreButton();
    this._filmCards = new FilmCards();

    this._showedCardControllers = [];

    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
  }

  _getSortedCards(cards, sortType, from, to) {
    let sortedCards = [];
    const showingCards = cards.slice();

    switch (sortType) {
      case SortType.SORT_DATE:
        sortedCards = showingCards.sort((a, b) => b.date - a.date);
        break;
      case SortType.SORT_RATING:
        sortedCards = showingCards.sort((a, b) => b.rating - a.rating);
        break;
      case SortType.DEFAULT:
        sortedCards = showingCards;
        break;
    }

    return sortedCards.slice(from, to);
  }

  _renderContainer() {
    if (!this._model.getCards().length) {
      render(this._container, this._message, RenderPosition.BEFOREEND);
    }

    this._menu = new Menu(this._model.getCards());

    render(this._container, this._menu, RenderPosition.BEFOREEND);
    render(this._container, this._sortComponent, RenderPosition.BEFOREEND);
    render(this._container, this._board, RenderPosition.BEFOREEND);
  }

  _renderCards(cards) {
    const cardListElement = this._filmCards.getElement().querySelector(`.films-list__container`);

    const newCards = renderCards(cardListElement, cards, this._onDataChange, this._onViewChange);
    this._showedCardControllers = this._showedCardControllers.concat(newCards);
    this._showingCardCount = this._showedCardControllers.length;
  }

  _renderContent() {
    const cards = this._model.getCards();

    const cardsContainer = this._filmCards.getElement().querySelector(`.films-list__container`);

    let filteredCards = getFilterdCards(cards, this._menu.getMenuType());

    render(this._board.getElement(), this._filmCards, RenderPosition.BEFOREEND);

    const rerenderCardsBySort = (sortType) => {
      this._showingCardCount = SHOW_CLICK_CARDS;

      const sortedCards = this._getSortedCards(filteredCards, sortType, 0, this._showingCardCount);

      cardsContainer.innerHTML = ``;
      const newCards = renderCards(cardsContainer, sortedCards, this._onDataChange, this._onViewChange);
      this._showedCardControllers = newCards;

      this._renderLoadMoreButton();
    };

    this._renderCards(cards.slice(0, this._showingCardCount));
    this._renderLoadMoreButton();

    this._menu.setMenuTypeChangeHandler((menuType) => {
      filteredCards = getFilterdCards(cards, menuType);
      rerenderCardsBySort(this._sortComponent.getSortType());
    });

    this._sortComponent.setSortTypeChangeHandler((sortType) => {
      rerenderCardsBySort(sortType);
    });
  }

  _renderExtraContent() {
    const cards = this._model.getCards();
    const filmsTopRatedData = cards.sort((a, b) => b.rating - a.rating).slice(0, COUNT_EXTRA_CARD);
    const filmsMostCommentedData = cards.sort((a, b) => b.comments.length - a.comments.length).slice(0, COUNT_EXTRA_CARD);

    const filmsTopRated = new FilmCardsExtra(`Top rated`);
    const filmsMostCommented = new FilmCardsExtra(`Most commented`);

    const filmsTopRatedContainer = filmsTopRated.getElement().querySelector(`.films-list__container`);
    const filmsMostCommentedContainer = filmsMostCommented.getElement().querySelector(`.films-list__container`);

    render(this._board.getElement(), filmsTopRated, RenderPosition.BEFOREEND);
    render(this._board.getElement(), filmsMostCommented, RenderPosition.BEFOREEND);

    renderCards(filmsTopRatedContainer, filmsTopRatedData.slice(0, COUNT_EXTRA_CARD));
    renderCards(filmsMostCommentedContainer, filmsMostCommentedData.slice(0, COUNT_EXTRA_CARD));
  }

  render() {
    this._renderContainer();
    this._renderContent();
    this._renderExtraContent();
  }

  _renderLoadMoreButton() {
    remove(this._moreButton);
    let filteredCards = getFilterdCards(this._model.getCards(), this._menu.getMenuType());

    if (this._showingCardCount >= filteredCards.length) {
      return;
    }

    render(this._filmCards.getElement(), this._moreButton, RenderPosition.BEFOREEND);

    this._moreButton.setClickHandler(() => {
      const prevCardCount = this._showingCardCount;
      const cardListElement = this._filmCards.getElement().querySelector(`.films-list__container`);
      this._showingCardCount = this._showingCardCount + SHOW_CLICK_CARDS;

      const sortedCards = this._getSortedCards(filteredCards, this._sortComponent.getSortType(), prevCardCount, this._showingCardCount);
      const newCards = renderCards(cardListElement, sortedCards, this._onDataChange, this._onViewChange);

      this._showedCardControllers = this._showedCardControllers.concat(newCards);
    });
  }

  _onViewChange() {
    this._showedCardControllers.forEach((it) => it.setDefaultView());
  }

  _onDataChange(cardController, oldData, newData) {
    if (this._model.updateCard(oldData.id, newData)) {
      cardController.render(newData);
    }
  }

  _onSortTypeChange(sortType) {
    this._showingCardCount = DEFAULT_CARDS;
    let filteredCards = getFilterdCards(this._model.getCards(), this._menu.getMenuType());

    const sortedCards = this._getSortedCards(filteredCards, sortType, 0, this._showingCardCount);
    const cardListElement = this._filmCards.getElement().querySelector(`.films-list__container`);

    cardListElement.innerHTML = ``;
    const newCards = renderCards(cardListElement, sortedCards, this._onDataChange, this._onViewChange);
    this._showedCardControllers = newCards;

    this._renderLoadMoreButton();
  }
}
