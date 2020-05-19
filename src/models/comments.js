export default class Comments {
  constructor() {
    this._comments = [];
  }

  getComments() {
    return this._comments;
  }

  getObjectComments() {
    return this._comments.reduce((prev, current) => {
      prev[current.id] = current;

      return prev;
    }, {});
  }

  setComments(comments) {
    this._comments = comments.reduce((prev, current) => {
      current.forEach((comment) => {
        prev.push(comment);
      });

      return prev;
    }, []);
  }

  removeComment(id) {
    const index = this._comments.findIndex((it) => it.id === id);

    if (index === -1) {
      return false;
    }

    this._comments = [].concat(this._comments.slice(0, index), this._comments.slice(index + 1));

    return true;
  }

  addComment(comment) {
    this._comments = [].concat(comment, this._comments);
  }
}
