import FilmsBoard from '@components/films-board.js';
import CardController, {Mode as CardControllerMode} from '@controllers/card.js';
import FilmCards from '@components/film-cards.js';
import FilmCardsExtra from '@components/film-extra-cards.js';
import Message from '@components/message.js';
import Loading from '@components/loading.js';
import MenuController from '@src/controllers/menu.js';
import MoreButton from '@components/more-button.js';

import Sort, {SortType} from '@components/sort.js';
import Statistics from '@components/statistics.js';
import {render, RenderPosition, remove} from '@src/utils/render.js';
import moment from 'moment';

const DEFAULT_CARDS = 5;
const SHOW_CLICK_CARDS = 5;
const COUNT_EXTRA_CARD = 2;

export default class Main {
  constructor(container, cardsModel, commentsModel, api) {
    this._container = container;
    this._cardsModel = cardsModel;
    this._commentsModel = commentsModel;
    this._api = api;

    this._showingCardCount = DEFAULT_CARDS;
    this._sortComponent = new Sort();
    this._board = new FilmsBoard();
    this._message = new Message();
    this._moreButton = new MoreButton();
    this._filmCards = new FilmCards();
    this._loading = new Loading();
    this._stat = null;
    this._filmsTopRated = new FilmCardsExtra(`Top rated`);
    this._filmsMostCommented = new FilmCardsExtra(`Most commented`);

    this._showedCardControllers = [];
    this._showedMostCommentedCardControllers = [];
    this._showedTopRatedCardControllers = [];

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

  _renderCards(cards, openCardId, scrollTop) {
    const cardListElement = this._filmCards.getElement().querySelector(`.films-list__container`);

    const newCards = cards.map((card) => {
      const mode = card.id === openCardId ? CardControllerMode.IS_OPEN : CardControllerMode.DEFAULT;
      const cardController = new CardController(cardListElement, this._onDataChange, this._onChangeComments, this._onViewChange);
      cardController.render(card, this._commentsModel.getObjectComments(), mode, scrollTop);

      return cardController;
    });
    this._showedCardControllers = this._showedCardControllers.concat(newCards);
    this._showingCardCount = this._showedCardControllers.length;
  }

  renderContainer() {
    const filterController = new MenuController(this._container, this._cardsModel, this._onStatClickChange);
    filterController.render();

    render(this._container, this._sortComponent, RenderPosition.BEFOREEND);
    render(this._container, this._board, RenderPosition.BEFOREEND);

    render(this._board.getElement(), this._filmCards, RenderPosition.BEFOREEND);

    render(this._filmCards.getElement(), this._loading, RenderPosition.BEFOREEND);
  }

  renderContent() {
    if (this._loading.getElement()) {
      remove(this._loading);
    }

    const cards = this._cardsModel.getCards();
    const cardListElement = this._filmCards.getElement().querySelector(`.films-list__container`);

    if (this._cardsModel.getCards().length) {
      this._renderCards(cards.slice(0, this._showingCardCount));
    } else {
      render(cardListElement, this._message, RenderPosition.BEFOREEND);
    }

    this._renderLoadMoreButton();
    this._renderExtraContent();

    this._stat = new Statistics(this._cardsModel);

    render(this._container, this._stat, RenderPosition.BEFOREEND);
    this._stat.hide();
  }

  _renderTopRatedFilmes() {
    const filmsTopRatedData = this._cardsModel.getCardsAll().slice().sort((a, b) => b.rating - a.rating).slice(0, COUNT_EXTRA_CARD);

    const filmsTopRatedContainer = this._filmsTopRated.getElement().querySelector(`.films-list__container`);

    const newCards = filmsTopRatedData.map((card) => {
      const cardController = new CardController(filmsTopRatedContainer, this._onDataChange, this._onChangeComments, this._onViewChange);
      cardController.render(card, this._commentsModel.getObjectComments());

      return cardController;
    });
    this._showedTopRatedCardControllers = this._showedTopRatedCardControllers.concat(newCards);
  }

  _renderMostCommentedFilmes() {
    const filmsMostCommentedData = this._cardsModel.getCardsAll().slice().sort((a, b) => b.comments.length - a.comments.length).slice(0, COUNT_EXTRA_CARD);
    const filmsMostCommentedContainer = this._filmsMostCommented.getElement().querySelector(`.films-list__container`);

    const newCards = filmsMostCommentedData.map((card) => {
      const cardController = new CardController(filmsMostCommentedContainer, this._onDataChange, this._onChangeComments, this._onViewChange);
      cardController.render(card, this._commentsModel.getObjectComments());

      return cardController;
    });
    this._showedMostCommentedCardControllers = this._showedMostCommentedCardControllers.concat(newCards);
  }

  _renderExtraContent() {
    const cards = this._cardsModel.getCardsAll();

    const filmsTopRatedHide = cards.every((it) => it.rating === 0);
    const filmsMostCommentedHide = cards.every((it) => it.comments.length === 0);

    if (!filmsTopRatedHide) {
      render(this._board.getElement(), this._filmsTopRated, RenderPosition.BEFOREEND);
      this._renderTopRatedFilmes();
    }

    if (!filmsMostCommentedHide) {
      render(this._board.getElement(), this._filmsMostCommented, RenderPosition.BEFOREEND);
      this._renderMostCommentedFilmes();
    }
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

  _removeTopRatedFilmes() {
    this._showedTopRatedCardControllers.forEach((cardController) => cardController.destroy());
    this._showedTopRatedCardControllers = [];
  }

  _removeMostCommentedFilmes() {
    this._showedMostCommentedCardControllers.forEach((cardController) => cardController.destroy());
    this._showedMostCommentedCardControllers = [];
  }

  _updateCards(count, openCardId, scrollTop) {
    const sortedCards = this._getSortedCards(this._cardsModel.getCards(), this._sortComponent.getSortType(), 0, count);
    const cardListElement = this._filmCards.getElement().querySelector(`.films-list__container`);
    this._removeCards();
    remove(this._message);

    if (sortedCards.length) {
      this._renderCards(sortedCards, openCardId, scrollTop);
    } else {
      render(cardListElement, this._message, RenderPosition.BEFOREEND);
    }

    this._renderLoadMoreButton();

    this._removeTopRatedFilmes();
    this._renderTopRatedFilmes();

    this._removeMostCommentedFilmes();
    this._renderMostCommentedFilmes();
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

  _addCommentData(cardController, oldCard, newComment, mode, scrollTop) {
    this._api.createComment(oldCard.id, newComment)
        .then(({comments, movie}) => {
          comments.forEach((comment) => {
            this._commentsModel.addComment(comment);
          });
          this._cardsModel.updateCard(movie.id, movie);
          const openCardId = mode === CardControllerMode.IS_OPEN ? movie.id : null;
          this._updateCards(this._showingCardCount, openCardId, scrollTop);
        }).catch(() => {
          cardController.shakeForm();
          cardController.disableForm(false);
        });
  }

  _removeCommentData(cardController, oldCard, id, newCard, mode, scrollTop) {
    this._api.deleteComment(id)
    .then(() => {
      this._commentsModel.removeComment(id);
      this._cardsModel.updateCard(newCard.id, newCard);
      const openCardId = mode === CardControllerMode.IS_OPEN ? newCard.id : null;
      this._updateCards(this._showingCardCount, openCardId, scrollTop);
    }).catch(() => {
      cardController.shakeComment(id);
    });
  }

  _onViewChange() {
    this._showedCardControllers.forEach((it) => it.setDefaultView());
  }

  _onDataChange(cardController, oldData, newData, mode, scrollTop) {
    this._api.updateMovie(oldData.id, newData)
      .then((cardModel) => {
        const isSuccess = this._cardsModel.updateCard(oldData.id, cardModel);

        if (isSuccess) {
          const openCardId = mode === CardControllerMode.IS_OPEN ? cardModel.id : null;
          this._updateCards(this._showingCardCount, openCardId, scrollTop);
        }
      });
  }

  _onChangeComments(cardController, oldCard, newCard, id, newComment, mode, scrollTop) {
    if (!id) {
      this._addCommentData(cardController, oldCard, newComment, mode, scrollTop);

      return;
    }

    if (newComment === null) {
      this._removeCommentData(cardController, oldCard, id, newCard, mode, scrollTop);
    }
  }

  _onSortTypeChange(sortType) {
    this._showingCardCount = DEFAULT_CARDS;
    const filteredCards = this._cardsModel.getCards();

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
      this._stat.isOpen = false;
      this.show();
      this._stat.hide();
    }

    this._sortComponent.reset();
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
