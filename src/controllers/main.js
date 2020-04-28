import Menu, {MenuType} from '@components/menu.js';
import Sort, {SortType} from '@components/sort.js';
import Board from '@components/filmsBoard.js';
import FilmCards from '@components/filmCards.js';
import Message from '@components/message.js';
import MoreButton from '@components/moreButton.js';
import Popup from '@components/popup.js';
import Card from '@components/card.js';
import FilmCardsExtra from '@components/extra.js';
import {render, RenderPosition, remove} from '@src/utils/render.js';

const DEFAULT_CARDS = 5;
const SHOW_CLICK_CARDS = 5;
const COUNT_EXTRA_CARD = 2;

const renderCard = function (container, data) {
  const card = new Card(data);
  const popup = new Popup(data);

  const openPopup = () => {
    const footer = document.querySelector(`.footer`);
    footer.innerHTML = ``;

    render(footer, popup, RenderPosition.BEFOREEND);
  };

  const closePopup = () => {
    const footer = document.querySelector(`.footer`);
    footer.innerHTML = ``;
  };

  const onEscKeyDown = (evt) => {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      closePopup();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  card.setClickPopupHandler(() => {
    openPopup();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  popup.setClickPopupHandler(()=>{
    closePopup();
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  render(container, card, RenderPosition.BEFOREEND);
};

const renderCards = function (container, cards) {
  cards.forEach((card) => {
    renderCard(container, card);
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
  constructor(container) {
    this._container = container;
    this._showingCardCount = DEFAULT_CARDS;
    this._sort = new Sort();
    this._board = new Board();
    this._message = new Message();
    this._moreButton = new MoreButton();
  }

  _renderSortedCards(cards, sortType, from, to) {
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

  _renderContainer(cards) {
    if (!cards.length) {
      render(this._container, this._message, RenderPosition.BEFOREEND);
    }

    this._menu = new Menu(cards);

    render(this._container, this._menu, RenderPosition.BEFOREEND);
    render(this._container, this._sort, RenderPosition.BEFOREEND);
    render(this._container, this._board, RenderPosition.BEFOREEND);
  }

  _renderContent(cards) {
    const filmCards = new FilmCards();
    const cardsContainer = filmCards.getElement().querySelector(`.films-list__container`);
    let filteredCards = getFilterdCards(cards, this._menu.getMenuType());

    render(this._board.getElement(), filmCards, RenderPosition.BEFOREEND);

    const renderLoadMoreButton = () => {
      if (this._showingCardCount >= filteredCards.length) {
        return;
      }

      render(filmCards.getElement(), this._moreButton, RenderPosition.BEFOREEND);

      this._moreButton.setClickHandler(() => {
        const prevCardCount = this._showingCardCount;
        this._showingCardCount = this._showingCardCount + SHOW_CLICK_CARDS;

        const sortedCards = this._renderSortedCards(filteredCards, this._sort.getSortType(), prevCardCount, this._showingCardCount);

        renderCards(cardsContainer, sortedCards);

        if (this._showingCardCount >= filteredCards.length) {
          remove(this._moreButton);
        }
      });
    };

    const rerenderCardsBySort = (sortType) => {
      this._showingCardCount = SHOW_CLICK_CARDS;

      const sortedCards = this._renderSortedCards(filteredCards, sortType, 0, this._showingCardCount);

      cardsContainer.innerHTML = ``;

      renderCards(cardsContainer, sortedCards);

      renderLoadMoreButton();
    };

    renderCards(cardsContainer, filteredCards.slice(0, this._showingCardCount));

    renderLoadMoreButton();

    this._menu.setMenuTypeChangeHandler((menuType) => {
      filteredCards = getFilterdCards(cards, menuType);
      rerenderCardsBySort(this._sort.getSortType());
    });

    this._sort.setSortTypeChangeHandler((sortType) => {
      rerenderCardsBySort(sortType);
    });
  }

  _renderExtraContent(cards) {
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

  render(cards) {
    this._renderContainer(cards);
    this._renderContent(cards);
    this._renderExtraContent(cards);
  }
}
