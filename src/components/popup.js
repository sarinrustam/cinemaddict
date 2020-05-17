import AbstractSmartComponent from '@components/abstract-smart-component.js';
import {formatTime, formatDateFull, formatDateFormComments} from '@src/utils/common.js';

import {encode} from 'he';

const createTemplate = (data) => {
  const time = formatTime(data.duration);
  const date = formatDateFull(data.date);

  return (
    `<section class="film-details">
    <form class="film-details__inner" action="" method="get">
      <div class="form-details__top-container">
        <div class="film-details__close">
          <button class="film-details__close-btn" type="button">close</button>
        </div>
        <div class="film-details__info-wrap">
          <div class="film-details__poster">
            <img class="film-details__poster-img" src="${data.poster}" alt="">

            <p class="film-details__age">${data.pg}</p>
          </div>

          <div class="film-details__info">
            <div class="film-details__info-head">
              <div class="film-details__title-wrap">
                <h3 class="film-details__title">${data.name}</h3>
                <p class="film-details__title-original">Original: ${data.name}</p>
              </div>

              <div class="film-details__rating">
                <p class="film-details__total-rating">${data.rating}</p>
              </div>
            </div>

            <table class="film-details__table">
              <tr class="film-details__row">
                <td class="film-details__term">Director</td>
                <td class="film-details__cell">${data.director}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Writers</td>
                <td class="film-details__cell">${data.writers}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Actors</td>
                <td class="film-details__cell">${data.actors}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Release Date</td>
                <td class="film-details__cell">${date}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Runtime</td>
                <td class="film-details__cell">${time}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Country</td>
                <td class="film-details__cell">${data.country}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Genres</td>
                <td class="film-details__cell">${data.genre.map((it)=>`<span class="film-details__genre">${it}</span>`).join(``)}</td>
              </tr>
            </table>

            <p class="film-details__film-description">${data.description}</p>
          </div>
        </div>

        <section class="film-details__controls">
          <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist">
          <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

          <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched">
          <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

          <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite">
          <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
        </section>
      </div>

      <div class="form-details__bottom-container">
        <section class="film-details__comments-wrap">
          <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${data.comments.length}</span></h3>

          <ul class="film-details__comments-list">
          ${data.comments.map((it, index) => `<li class="film-details__comment" data-id=${index}>
          <span class="film-details__comment-emoji">
            <img src="./images/emoji/${it.emoji}.png" width="55" height="55" alt="emoji-${it.alt}">
          </span>
          <div>
            <p class="film-details__comment-text">${encode(it.text)}</p>
            <p class="film-details__comment-info">
              <span class="film-details__comment-author">${it.author}</span>
              <span class="film-details__comment-day">${formatDateFormComments(it.date)}</span>
              <button class="film-details__comment-delete">Delete</button>
            </p>
          </div>
        </li>`).join(``)}
          </ul>

          <div class="film-details__new-comment">
            <div for="add-emoji" class="film-details__add-emoji-label"></div>

            <label class="film-details__comment-label">
              <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
            </label>

            <div class="film-details__emoji-list">
              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
              <label class="film-details__emoji-label" for="emoji-smile">
                <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
              </label>

              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
              <label class="film-details__emoji-label" for="emoji-sleeping">
                <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
              </label>

              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
              <label class="film-details__emoji-label" for="emoji-puke">
                <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
              </label>

              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
              <label class="film-details__emoji-label" for="emoji-angry">
                <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
              </label>
            </div>
          </div>
        </section>
      </div>
    </form>
  </section>`
  );
};

export default class Popup extends AbstractSmartComponent {
  constructor(data) {
    super();

    this._data = data;
    this._newComment = {
      text: ``,
      emoji: ``,
      alt: ``
    };

    this._popupClickHandler = null;
    this._submitHandler = null;

    this._subscribeOnEvents();
  }

  reset() {
    this._newComment.text = ``;

    this.rerender();
  }

  getNewComment() {
    return Object.assign({}, this._newComment, {
      author: ``,
      date: new Date()
    });
  }

  recoveryListeners() {
    this.setSubmitHandler(this._submitHandler);
    this._subscribeOnEvents();
  }

  rerender() {
    super.rerender();
  }

  getTemplate() {
    return createTemplate(this._data);
  }

  setClickPopupHandler(handler) {
    const closeBtn = this.getElement().querySelector(`.film-details__close-btn`);

    closeBtn.addEventListener(`click`, handler);

    this._popupClickHandler = handler;
  }

  _subscribeOnEvents() {
    const element = this.getElement();

    const smileInputArray = Array.from(element.querySelectorAll(`.film-details__emoji-item`));

    smileInputArray.forEach((it) => {
      it.addEventListener(`change`, (evt) => {
        const label = element.querySelector(`label[for="${evt.target.id}"]`);
        const image = label.firstElementChild.cloneNode();

        const putPlaceContainer = element.querySelector(`.film-details__add-emoji-label`);
        putPlaceContainer.innerHTML = ``;
        this._newComment.emoji = `${evt.target.value}.png`;
        putPlaceContainer.appendChild(image);
      });
    });

    const popupButtonsArray = Array.from(element.querySelectorAll(`.film-details__control-input`));

    popupButtonsArray.forEach((it) => {
      it.addEventListener(`change`, () => {
      });
    });

    element.querySelector(`.film-details__comment-input`).addEventListener(`input`, (evt) => {
      this._newComment.text = evt.target.value;
    });
  }

  setSubmitHandler(handler) {
    this.getElement().querySelector(`form`).addEventListener(`keydown`, handler);

    this._submitHandler = handler;
  }

  setDeleteCommentHandler(handler) {
    const deleteButtons = Array.from(this.getElement().querySelectorAll(`.film-details__comment-delete`));

    deleteButtons.forEach((it) => {
      it.addEventListener(`click`, handler);
    });
  }
}

