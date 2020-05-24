import Card from '@src/models/card.js';
import Comment from '@src/models/comment.js';

const CodesErrors = {
  200: `200`,
  300: `300`,
};

const Methods = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

const checkStatus = (response) => {
  if (response.status >= CodesErrors[200] && response.status < CodesErrors[300]) {
    return response;
  } else {
    throw new Error(`Код ошибки: ${response.status}. Текст ошибки: ${response.statusText}`);
  }
};

export default class API {
  constructor(endPoint, authorization) {
    this._authorization = authorization;
    this._endPoint = endPoint;
  }

  getMovies() {
    return this._load({url: `movies`})
      .then((response) => response.json())
      .then(Card.parseMovies);
  }

  updateMovie(id, data) {
    return this._load({
      url: `movies/${id}`,
      method: Methods.PUT,
      body: JSON.stringify(data.toRAW()),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then((response) => response.json())
      .then(Card.parseMovie);
  }

  getComment(id) {
    return this._load({url: `comments/${id}`})
      .then((response) => response.json())
      .then(Comment.parseComments);
  }

  createComment(id, comment) {
    return this._load({
      url: `comments/${id}`,
      method: Methods.POST,
      body: JSON.stringify(comment.toRAW()),
      headers: new Headers({"Content-Type": `application/json`}),
    })
      .then((response) => response.json())
      .then(({comments, movie}) => {
        return {
          comments: Comment.parseComments(comments),
          movie: Card.parseMovie(movie)
        };
      });
  }

  deleteComment(id) {
    return this._load({url: `comments/${id}`, method: Methods.DELETE});
  }

  sync(data) {
    return this._load({
      url: `movies/sync`,
      method: Methods.POST,
      body: JSON.stringify(data),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then((response) => response.json());
  }

  _load({url, method = Methods.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
       .then(checkStatus)
       .catch((err) => {
         throw err;
       });
  }
}
