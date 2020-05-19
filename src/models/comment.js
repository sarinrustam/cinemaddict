export default class Comment {
  constructor(data) {
    this.text = data[`comment`];
    this.author = data[`author`];
    this.date = data[`date`];
    this.emoji = data[`emotion`];
    this.id = data[`id`];
  }

  static parseComment(data) {
    return new Comment(data);
  }

  static parseComments(data) {
    return data.map(Comment.parseComment);
  }

  static clone(data) {
    return new Comment(data.toRAW());
  }

  toRAW() {
    return {
      "comment": this.text,
      "author": this.author,
      "date": this.date,
      "emotion": this.emoji,
      "id": this.id
    };
  }
}
