import Card from '@src/models/card.js';
import Comment from '@src/models/comment.js';

export default class API {
  constructor(authorization) {
    this._authorization = authorization;
  }

  getMovies() {
    const headers = new Headers();
    headers.append(`Authorization`, this._authorization);

    return fetch(`https://11.ecmascript.pages.academy/cinemaddict/movies`, {headers})
      .then((response) => response.json())
      .then(Card.parseMovies);
  }

  getComment(id) {
    const headers = new Headers();
    headers.append(`Authorization`, this._authorization);

    return fetch(`https://11.ecmascript.pages.academy/cinemaddict/comments/${id}`, {headers})
      .then((response) => response.json())
      .then(Comment.parseComments);
  }
}
