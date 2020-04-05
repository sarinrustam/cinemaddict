
import {renderRank} from '@components/rank.js';
import {renderMenu} from '@components/menu.js';
import {renderSort} from '@components/sort.js';
import {renderBoard} from '@components/filmsBoard.js';
import {renderFilmCards} from '@components/filmCards.js';
import {renderButton} from '@components/moreButton.js';
import {renderExtraBoard} from '@components/extra.js';
import {renderPopup} from '@components/popup.js';

// render functions

const init = function () {
  const filmsData = [{
    title: `The Dance of Life`,
    rating: `8.3`,
    year: `1929`,
    duration: `1h 55m`,
    genre: `Musical`,
    image: `./images/posters/the-dance-of-life.jpg`,
    description: `Burlesque comic Ralph "Skid" Johnson (Skelly), and specialty dancer Bonny Lee King (Carroll), end up together on a cold, rainy night at a tr…`,
    comments: `5 comments`
  },
  {
    title: `Sagebrush Trail`,
    rating: `3.2`,
    year: `1933`,
    duration: `54m`,
    genre: `Western`,
    image: `./images/posters/sagebrush-trail.jpg`,
    description: `Sentenced for a murder he did not commit, John Brant escapes from prison determined to find the real killer. By chance Brant's narrow escap…`,
    comments: `89 comments`
  },
  {
    title: `The Man with the Golden Arm`,
    rating: `9.0`,
    year: `1955`,
    duration: `1h 59m`,
    genre: `Drama`,
    image: `./images/posters/the-man-with-the-golden-arm.jpg`,
    description: `Frankie Machine (Frank Sinatra) is released from the federal Narcotic Farm in Lexington, Kentucky with a set of drums and a new outlook on…`,
    comments: `18 comments`
  },
  {
    title: `Santa Claus Conquers the Martians`,
    rating: `2.3`,
    year: `1964`,
    duration: `1h 21m`,
    genre: `Comedy`,
    image: `./images/posters/santa-claus-conquers-the-martians.jpg`,
    description: `The Martians Momar ("Mom Martian") and Kimar ("King Martian") are worried that their children Girmar ("Girl Martian") and Bomar ("Boy Marti…`,
    comments: `465 comments`
  },
  {
    title: `Popeye the Sailor Meets Sindbad the Sailor`,
    rating: `6.3`,
    year: `1936`,
    duration: `16m`,
    genre: `Cartoon`,
    image: `./images/posters/popeye-meets-sinbad.png`,
    description: `In this short, Sindbad the Sailor (presumably Bluto playing a "role") proclaims himself, in song, to be the greatest sailor, adventurer and…`,
    comments: `0 comments`
  }
  ];

  const filmsTopRatedData = [{
    title: `The Man with the Golden Arm`,
    rating: `9.0`,
    year: `1955`,
    duration: `1h 59m`,
    genre: `Drama`,
    image: `./images/posters/the-man-with-the-golden-arm.jpg`,
    description: `Frankie Machine (Frank Sinatra) is released from the federal Narcotic Farm in Lexington, Kentucky with a set of drums and a new outlook on…`,
    comments: `18 comments`
  },
  {
    title: `The Great Flamarion`,
    rating: `8.9`,
    year: `1945`,
    duration: `1h 18m`,
    genre: `Mystery`,
    image: `./images/posters/the-great-flamarion.jpg`,
    description: `The film opens following a murder at a cabaret in Mexico City in 1936, and then presents the events leading up to it in flashback. The Grea…`,
    comments: `12 comments`
  }
  ];

  const filmsMostCommentedData = [{
    title: `Santa Claus Conquers the Martians`,
    rating: `2.3`,
    year: `1964`,
    duration: `1h 21m`,
    genre: `Comedy`,
    image: `./images/posters/santa-claus-conquers-the-martians.jpg`,
    description: `The Martians Momar ("Mom Martian") and Kimar ("King Martian") are worried that their children Girmar ("Girl Martian") and Bomar ("Boy Marti…`,
    comments: `465 comments`
  },
  {
    title: `Made for Each Other`,
    rating: `5.8`,
    year: `1939`,
    duration: `1h 32m`,
    genre: `Comedy`,
    image: `./images/posters/made-for-each-other.png`,
    description: `John Mason (James Stewart) is a young, somewhat timid attorney in New York City. He has been doing his job well, and he has a chance of bei…`,
    comments: `56 comments`
  }
  ];

  const main = document.querySelector(`.main`);
  const header = document.querySelector(`.header`);

  renderRank(header);
  renderMenu(main);
  renderSort(main);
  renderBoard(main);

  const filmsList = main.querySelector(`.films-list`);
  const filmsElement = main.querySelector(`.films`);
  const filmsListContainer = filmsList.querySelector(`.films-list__container`);

  renderFilmCards(filmsListContainer, filmsData);
  renderButton(filmsList);
  renderExtraBoard(filmsElement);

  const filmsListExtra = filmsElement.querySelectorAll(`.films-list--extra`);
  const topRatedContainer = filmsListExtra[0].querySelector(`.films-list__container`);
  const mostCommentsContainer = filmsListExtra[1].querySelector(`.films-list__container`);

  renderFilmCards(topRatedContainer, filmsTopRatedData);
  renderFilmCards(mostCommentsContainer, filmsMostCommentedData);

  renderPopup();
};

init();
