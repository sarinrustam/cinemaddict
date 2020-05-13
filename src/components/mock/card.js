import {getRandomElement, getRandomNumber} from '@src/utils/common.js';

const FILM_NAMES = [
  `The Matrix`,
  `The Lord of the rings`,
  `The Interstellar`,
  `Mother!`,
  `Shutter Island`,
  `13 Reasons why`,
  `The Dark`
];

const FILM_POSTERS = [
  `made-for-each-other.png`,
  `popeye-meets-sinbad.png`,
  `sagebrush-trail.jpg`,
  `santa-claus-conquers-the-martians.jpg`,
  `the-dance-of-life.jpg`,
  `the-great-flamarion.jpg`,
  `the-man-with-the-golden-arm.jpg`
];

const FILM_GENRES = [
  `Drama`,
  `Noir`,
  `Horror`,
  `Fantazy`,
  `Comedy`,
  `Western`,
  `Anime`,
  `Social-drama`,
  `Melodrama`
];

const FILM_DESCRIPTION = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`;

const DIRECTORS = [
  `Michael Bay`,
  `Nikita Mikhalkov`,
  `Evgeniy Bajenov`,
  `Cristofer Nolan`,
  `Martin Scorceze`,
  `Rustam Sarin`,
  `Lobova Anastasiya`,
  `Sobaka Spacey`,
];

const WRITERS = [
  `Pol Bettani`,
  `Sobaka Spacey`,
  `Richard Matt`,
  `Allow Bishop`,
  `Get out`,
  `Mila Jonison`,
  `Thor Loki`,
  `Kate Sale`,
];

const ACTORS = [
  `Jimmy Floyd`,
  `Keanu Reeves`,
  `Cristian Bale`,
  `Kate Beckinsale`,
  `Robert Downey`,
  `Matt Mack`,
  `Sobaka Spacey`,
  `Enot Koko`
];

const COUNTRIES = [
  `Portugal`,
  `Spain`,
  `USA`,
  `Ecuador`,
  `Russia`,
  `UK`,
  `Ukraine`,
  `France`,
  `Germany`,
];

const PG_RATING = [
  `G`,
  `PG`,
  `PG-13`,
  `R`,
  `NC-17`
];

const TYPES = [
  `watchlist`,
  `history`,
  `favorites`,
];

const MINUTES = {
  MIN: 90,
  MAX: 300,
};

const getRandomSentences = (string) => {
  const COUNT_FROM_SENTENCES = 1;
  const COUNT_TO_SENTENCES = 5;

  return string.split(`.`).slice(0, getRandomNumber(COUNT_FROM_SENTENCES, COUNT_TO_SENTENCES)).join(`.`);
};

const DATE_FILM_START = `2020`;
const DATE_COMMENT_START = `2020`;

const getRandomDate = (min) => {
  const minDate = new Date(min);
  const maxDate = new Date();
  return new Date(getRandomNumber(minDate.getTime(), maxDate.getTime()));
};

const COMMENTS = [{
  emoji: `angry.png`,
  date: getRandomDate(DATE_COMMENT_START),
  alt: `angry`,
  author: `Timo Verner`,
  text: `Hello darkness my old friend`
}, {
  emoji: `puke.png`,
  date: getRandomDate(DATE_COMMENT_START),
  alt: `puke`,
  author: `Cristiano Ronaldo`,
  text: `I've come to talk with you again`
}, {
  emoji: `sleeping.png`,
  date: getRandomDate(DATE_COMMENT_START),
  alt: `sleeping`,
  author: `Pablo Acosta`,
  text: `Because a vision softly creeping`
}, {
  emoji: `smile.png`,
  date: getRandomDate(DATE_COMMENT_START),
  alt: `smile`,
  author: `Jimmy Hendrix`,
  text: `How i can join in your heart`
}, {
  emoji: `angry.png`,
  date: getRandomDate(DATE_COMMENT_START),
  alt: `angry`,
  author: `Kate Backinsale`,
  text: `lol idc coz of u`,
}
];

const getRandomComments = (array) => {
  const COUNT_FROM_COMMENTS = 0;
  const COUNT_TO_COMMENTS = 5;

  return array.slice(0, getRandomNumber(COUNT_FROM_COMMENTS, COUNT_TO_COMMENTS));
};

const getRandomRating = () => {
  const ratingFrom = 1;
  const ratingTo = 8;

  return +`${getRandomNumber(ratingFrom, ratingTo).toFixed(0)}.${getRandomNumber(ratingFrom, ratingTo).toFixed(0)}`;
};

const getRandomGenres = (array) => {
  const genreFrom = 1;
  const genreTo = 3;

  return array.slice(0, getRandomNumber(genreFrom, genreTo));
};

const description = getRandomSentences(FILM_DESCRIPTION);

const getShortDescription = () => {
  return description.slice(0, 140);
};

const getRandomWriters = (array) => {
  const WRITERS_FROM = 1;
  const WRITERS_TO = 4;

  return array.slice(0, getRandomNumber(WRITERS_FROM, WRITERS_TO));
};

const writersList = getRandomWriters(WRITERS);

const getRandomActors = (array) => {
  const ACTORS_FROM = 1;
  const ACTORS_TO = 5;

  return array.slice(0, getRandomNumber(ACTORS_FROM, ACTORS_TO));
};

const actorsList = getRandomActors(ACTORS);

const getFilmData = () => {
  return {
    id: String(new Date() + Math.random()),
    name: getRandomElement(FILM_NAMES),
    poster: getRandomElement(FILM_POSTERS),
    description,
    comments: getRandomComments(COMMENTS),
    rating: getRandomRating(),
    duration: getRandomNumber(MINUTES.MIN, MINUTES.MAX),
    gernes: getRandomGenres(FILM_GENRES),
    shortDescription: getShortDescription(),
    director: getRandomElement(DIRECTORS),
    writers: writersList,
    actors: actorsList,
    country: getRandomElement(COUNTRIES),
    pg: getRandomElement(PG_RATING),
    type: getRandomElement(TYPES),
    isFavorite: !!getRandomNumber(0, 1),
    isWatched: !!getRandomNumber(0, 1),
    isInWatchlist: !!getRandomNumber(0, 1),
    date: getRandomDate(DATE_FILM_START),
  };
};

const getFilmsData = () => {
  const COUNT_OBJECTS = 15;

  const currentArray = [];

  for (let i = 0; i < COUNT_OBJECTS; i++) {
    currentArray.push(getFilmData());
  }
  return currentArray;
};

export {getFilmsData};
