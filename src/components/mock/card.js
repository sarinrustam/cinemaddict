import {getRandomElement, getRandomNumber} from '@components/utils.js';

const filmNames = [
  `The Matrix`,
  `The Lord of the rings`,
  `The Interstellar`,
  `Mother!`,
  `Shutter Island`,
  `13 Reasons why`,
  `The Dark`
];

const filmPosters = [
  `made-for-each-other.png`,
  `popeye-meets-sinbad.png`,
  `sagebrush-trail.jpg`,
  `santa-claus-conquers-the-martians.jpg`,
  `the-dance-of-life.jpg`,
  `the-great-flamarion.jpg`,
  `the-man-with-the-golden-arm.jpg`
];

const filmGenres = [
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

const filmDescription = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`;

const comments = [{
  emoji: `angry.png`,
  date: `2019/12/31 23:59`,
  alt: `angry`,
  author: `Timo Verner`,
  text: `Hello darkness my old friend`
}, {
  emoji: `puke.png`,
  date: `2 days ago`,
  alt: `puke`,
  author: `Cristiano Ronaldo`,
  text: `I've come to talk with you again`
}, {
  emoji: `sleeping.png`,
  date: `1 days ago`,
  alt: `sleeping`,
  author: `Pablo Acosta`,
  text: `Because a vision softly creeping`
}, {
  emoji: `smile.png`,
  date: `tomorrow`,
  alt: `smile`,
  author: `Jimmy Hendrix`,
  text: `How i can join in your heart`
}, {
  emoji: `angry.png`,
  date: `today`,
  alt: `angry`,
  author: `Kate Backinsale`,
  text: `lol idc coz of u`,
}
];

const directors = [
  `Michael Bay`,
  `Nikita Mikhalkov`,
  `Evgeniy Bajenov`,
  `Cristofer Nolan`,
  `Martin Scorceze`,
  `Rustam Sarin`,
  `Lobova Anastasiya`,
  `Sobaka Spacey`,
];

const writers = [
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
  `Watchlist`,
  `History`,
  `Favorite`,
];

const getRandomSentences = (string) => {
  const COUNT_FROM_SENTENCES = 1;
  const COUNT_TO_SENTENCES = 5;

  return string.split(`.`).slice(0, getRandomNumber(COUNT_FROM_SENTENCES, COUNT_TO_SENTENCES)).join(`.`);
};

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

const getRandomDuration = () => {
  const hourFrom = 1;
  const hourTo = 3;

  const minuteFrom = 0;
  const minuteTo = 9;

  const secondFrom = 0;
  const secondTo = 9;

  return `${getRandomNumber(hourFrom, hourTo)}h ${getRandomNumber(minuteFrom, minuteTo)}${getRandomNumber(secondFrom, secondTo)}m`;
};

const getRandomGenres = (array) => {
  const genreFrom = 1;
  const genreTo = 3;

  return array.slice(0, getRandomNumber(genreFrom, genreTo));
};

const description = getRandomSentences(filmDescription);

const getShortDescription = () => {
  return description.slice(0, 140);
};

const getRandomWriters = (array) => {
  const WRITERS_FROM = 1;
  const WRITERS_TO = 4;

  return array.slice(0, getRandomNumber(WRITERS_FROM, WRITERS_TO));
};

const writersList = getRandomWriters(writers);

const getRandomActors = (array) => {
  const ACTORS_FROM = 1;
  const ACTORS_TO = 5;

  return array.slice(0, getRandomNumber(ACTORS_FROM, ACTORS_TO));
};

const actorsList = getRandomActors(ACTORS);


const getRandomDate = () => {
  const minDate = new Date(`1921`);
  const maxDate = new Date();
  return new Date(getRandomNumber(minDate.getTime(), maxDate.getTime()));
};

const getFilmData = () => {
  return {
    name: getRandomElement(filmNames),
    poster: getRandomElement(filmPosters),
    description,
    comments: getRandomComments(comments),
    rating: getRandomRating(),
    duration: getRandomDuration(),
    gernes: getRandomGenres(filmGenres),
    shortDescription: getShortDescription(),
    director: getRandomElement(directors),
    writers: writersList,
    actors: actorsList,
    country: getRandomElement(COUNTRIES),
    pg: getRandomElement(PG_RATING),
    type: getRandomElement(TYPES),
    date: getRandomDate(),
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
