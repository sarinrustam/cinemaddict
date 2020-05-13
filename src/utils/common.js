import moment from 'moment';

export const Buttons = {
  LMB: 0,
  ENT: `Enter`,
  ESC: `Escape`,
};

export const StatMenuTypes = {
  ALL_TIME: `all-time`,
  TODAY: `today`,
  WEEK: `week`,
  MONTH: `month`,
  YEAR: `year`
};

export const MenuTypes = {
  ALL_MOVIES: `all-movies`,
  WATCHLIST: `watchlist`,
  HISTORY: `history`,
  FAVORITES: `favorites`,
};

export const getRandomNumber = function (from, to) {
  let number = from + Math.random() * (to + 1 - from);
  return Math.floor(number);
};

export const getRandomElement = function (array) {
  return array[getRandomNumber(0, array.length - 1)];
};

export const formatDateFull = (date) => {
  return moment(date).format(`DD MMMM YYYY`);
};

export const formatDateYear = (date) => {
  return moment(date).format(`YYYY`);
};

export const formatDateFormComments = (date) => {
  return moment(date).fromNow();
};

export const formatTime = (date) => {
  const duration = moment().hour(0).minutes(date);
  const durationHour = duration.format(`h`);
  const durationMinutes = duration.format(`m`);
  return durationHour ? `${durationHour}h ${durationMinutes}m` : `${durationMinutes}m`;
};
