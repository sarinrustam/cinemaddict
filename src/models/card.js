export default class Card {
  constructor(data) {
    this.id = data[`id`];
    this.comments = data[`comments`];
    this.actors = data[`film_info`][`actors`];
    this.pg = data[`film_info`][`age_rating`];
    this.shortDescription = data[`film_info`][`alternative_title`];
    this.description = data[`film_info`][`description`];
    this.director = data[`film_info`][`director`];
    this.genre = data[`film_info`][`genre`];
    this.poster = data[`film_info`][`poster`];
    this.date = data[`film_info`][`release`][`date`];
    this.country = data[`film_info`][`release`][`release_country`];
    this.duration = data[`film_info`][`runtime`];
    this.name = data[`film_info`][`title`];
    this.rating = data[`film_info`][`total_rating`];
    this.writers = data[`film_info`][`writers`];
    this.isWatched = data[`user_details`][`already_watched`];
    this.isFavorite = data[`user_details`][`favorite`];
    this.isInWatchlist = data[`user_details`][`watchlist`];
    this.watchingDate = data[`user_details`][`watching_date`];
  }

  static parseMovie(data) {
    return new Card(data);
  }

  static parseMovies(data) {
    return data.map(Card.parseMovie);
  }
}
