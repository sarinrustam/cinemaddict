import Board from '@components/filmsBoard.js';
import CardController, {Mode as CardControllerMode} from '@controllers/card.js';
import FilmCards from '@components/filmCards.js';
import FilmCardsExtra from '@components/extra.js';
import Message from '@components/message.js';
import MenuController from '@src/controllers/menu.js';
import MoreButton from '@components/moreButton.js';

import Sort, {SortType} from '@components/sort.js';
import Statistics from '@components/statistics.js';
import {render, RenderPosition, remove} from '@src/utils/render.js';
import moment from 'moment';

const DEFAULT_CARDS = 5;
const SHOW_CLICK_CARDS = 5;
const COUNT_EXTRA_CARD = 2;

const renderCards = function (container, cards, comments, onDataChange, onChangeComments, onViewChange) {
  return cards.map((card) => {
    const cardController = new CardController(container, onDataChange, onChangeComments, onViewChange);
    cardController.render(card, comments);

    return cardController;
  });
};

export default class MainController {
  constructor(container, cardsModel, commentsModel, api) {
    this._container = container;
    this._cardsModel = cardsModel;
    this._commentsModel = commentsModel;
    this._api = api;

    this._showingCardCount = DEFAULT_CARDS;
    this._sortComponent = new Sort();
    this._board = new Board();
    this._message = new Message();
    this._moreButton = new MoreButton();
    this._filmCards = new FilmCards();
    this._stat = null;
    this._filmsTopRated = new FilmCardsExtra(`Top rated`);
    this._filmsMostCommented = new FilmCardsExtra(`Most commented`);

    this._showedCardControllers = [];

    this._onLoadMoreButtonClick = this._onLoadMoreButtonClick.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onChangeComments = this._onChangeComments.bind(this);
    this._onMenuChange = this._onMenuChange.bind(this);
    this._onStatClickChange = this._onStatClickChange.bind(this);

    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
    this._cardsModel.setMenuChangeHandler(this._onMenuChange);
  }

  _renderLoadMoreButton() {
    remove(this._moreButton);

    if (this._showingCardCount >= this._cardsModel.getCards().length) {
      return;
    }

    render(this._filmCards.getElement(), this._moreButton, RenderPosition.BEFOREEND);

    this._moreButton.setClickHandler(this._onLoadMoreButtonClick);
  }

  _renderCards(cards) {
    const comments = this._commentsModel.getObjectComments();
    const cardListElement = this._filmCards.getElement().querySelector(`.films-list__container`);

    const newCards = renderCards(cardListElement, cards, comments, this._onDataChange, this._onChangeComments, this._onViewChange);
    this._showedCardControllers = this._showedCardControllers.concat(newCards);
    this._showingCardCount = this._showedCardControllers.length;
  }

  _renderContainer() {
    if (!this._cardsModel.getCards().length) {
      render(this._container, this._message, RenderPosition.BEFOREEND);
    }

    const filterController = new MenuController(this._container, this._cardsModel);
    filterController.render();

    filterController.setStatisticsClickHandler(this._onStatClickChange);

    this._stat = new Statistics(this._cardsModel);

    render(this._container, this._stat, RenderPosition.BEFOREEND);
    this._stat.hide();

    render(this._container, this._sortComponent, RenderPosition.BEFOREEND);
    render(this._container, this._board, RenderPosition.BEFOREEND);
  }

  _renderContent() {
    const cards = this._cardsModel.getCards();

    render(this._board.getElement(), this._filmCards, RenderPosition.BEFOREEND);

    this._renderCards(cards.slice(0, this._showingCardCount));
    this._renderLoadMoreButton();
  }

  _renderExtraContent() {
    const cards = this._cardsModel.getCards();
    const comments = this._commentsModel.getObjectComments();
    const filmsTopRatedData = cards.sort((a, b) => b.rating - a.rating).slice(0, COUNT_EXTRA_CARD);
    const filmsMostCommentedData = cards.sort((a, b) => b.comments.length - a.comments.length).slice(0, COUNT_EXTRA_CARD);

    const filmsTopRatedContainer = this._filmsTopRated.getElement().querySelector(`.films-list__container`);
    const filmsMostCommentedContainer = this._filmsMostCommented.getElement().querySelector(`.films-list__container`);

    render(this._board.getElement(), this._filmsTopRated, RenderPosition.BEFOREEND);
    render(this._board.getElement(), this._filmsMostCommented, RenderPosition.BEFOREEND);

    renderCards(filmsTopRatedContainer, filmsTopRatedData.slice(0, COUNT_EXTRA_CARD), comments, this._onDataChange, this._onChangeComments, this._onViewChange);
    renderCards(filmsMostCommentedContainer, filmsMostCommentedData.slice(0, COUNT_EXTRA_CARD), comments, this._onDataChange, this._onChangeComments, this._onViewChange);
  }

  render() {
    this._renderContainer();
    this._renderContent();
    this._renderExtraContent();
  }

  _getSortedCards(cards, sortType, from, to) {
    let sortedCards = [];
    const showingCards = cards.slice();

    switch (sortType) {
      case SortType.SORT_DATE:
        sortedCards = showingCards.sort((a, b) => moment(b.date) - moment(a.date));
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

  _removeCards() {
    this._showedCardControllers.forEach((cardController) => cardController.destroy());
    this._showedCardControllers = [];
  }

  _updateCards(count) {
    this._removeCards();
    this._renderCards(this._cardsModel.getCards().slice(0, count));
    this._renderLoadMoreButton();
    this._sortComponent.reset();
  }

  _addCardData(cardController, newData) {
    this._cardsModel.addCard(newData);
    cardController.render(newData, CardControllerMode.DEFAULT);

    if (this._showingCardCount % DEFAULT_CARDS === 0) {
      const destroyedCard = this._showedCardControllers.pop();
      destroyedCard.destroy();
    }

    this._showedCardControllers = [].concat(cardController, this._showedCardControllers);
    this._showingCardCount = this._showedCardControllers.length;

    this._renderLoadMoreButton();
  }

  _removeCardData(data) {
    this._cardsModel.removeCard(data.id);
    this._updateCards(this._showingCardCount);
  }

  _addCommentData(cardController, oldCard, newComment) {
    this._api.createComment(oldCard.id, newComment)
        .then(({comments, movie}) => {
          comments.forEach((comment) => {
            this._commentsModel.addComment(comment);
          });
          this._cardsModel.updateCard(movie.id, movie);
          cardController.render(movie, this._commentsModel.getObjectComments(), CardControllerMode.IS_OPEN);
          cardController.formIsDisabled = false;
        }).catch(() => {
          cardController.shakeForm();
        });
  }

  _removeCommentData(cardController, id, newCard) {
    this._api.deleteComment(id)
    .then(() => {
      this._commentsModel.removeComment(id);
      cardController.render(newCard, this._commentsModel.getObjectComments(), CardControllerMode.IS_OPEN);
    }).catch(() => {
      cardController.shakeComment(id);
    });
  }

  _onViewChange() {
    this._showedCardControllers.forEach((it) => it.setDefaultView());
  }

  _onDataChange(cardController, oldData, newData) {
    this._api.updateMovie(oldData.id, newData)
      .then((cardModel) => {
        const isSuccess = this._cardsModel.updateCard(oldData.id, cardModel);

        if (isSuccess) {
          cardController.render(cardModel, this._commentsModel.getObjectComments(), CardControllerMode.IS_OPEN);
          this._updateCards(this._showingCardsCount);
        }
      });
  }

  _onChangeComments(cardController, oldCard, newCard, id, newComment) {
    if (!id) {
      this._addCommentData(cardController, oldCard, newComment);

      return;
    }

    if (newComment === null) {
      this._removeCommentData(cardController, id, newCard);
    }
  }

  _onSortTypeChange(sortType) {
    this._showingCardCount = DEFAULT_CARDS;
    let filteredCards = this._cardsModel.getCards();

    const sortedCards = this._getSortedCards(filteredCards, sortType, 0, this._showingCardCount);
    this._removeCards();
    this._renderCards(sortedCards);

    this._renderLoadMoreButton();
  }

  _onLoadMoreButtonClick() {
    const prevCardCount = this._showingCardCount;
    const cards = this._cardsModel.getCards();
    const comments = this._commentsModel.getObjectComments();

    this._showingCardCount = this._showingCardCount + SHOW_CLICK_CARDS;

    const sortedCards = this._getSortedCards(cards, this._sortComponent.getSortType(), prevCardCount, this._showingCardCount);
    this._renderCards(sortedCards, comments);

    if (this._showingCardCount >= cards.length) {
      remove(this._moreButton);
    }
  }

  _onMenuChange() {
    if (this._stat.isOpen) {
      this._stat.hide();
      this._stat.isOpen = false;
      this.show();
    }

    this._updateCards(DEFAULT_CARDS);
  }

  _onStatClickChange() {
    if (this._stat.isOpen) {
      this._stat.hide();
      this._stat.isOpen = false;
      this.show();
    } else {
      this._stat.show();
      this._stat.isOpen = true;
      this.hide();
    }
  }

  hide() {
    this._sortComponent.hide();
    this._updateCards(DEFAULT_CARDS);
    this._filmCards.hide();
    this._filmsTopRated.hide();
    this._filmsMostCommented.hide();
  }

  show() {
    this._sortComponent.show();
    this._filmCards.show();
    this._filmsTopRated.show();
    this._filmsMostCommented.show();
  }
}
