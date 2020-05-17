import AbstractSmartComponent from '@components/abstract-smart-component.js';
import {StatMenuTypes} from '@src/utils/common.js';
import Chart from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import moment from 'moment';

const MINUTES_IN_HOUR = 60;

const getFilteredCards = (cards, filter) => {
  return cards.filter((it) => {
    const date = it.date;
    switch (filter) {
      case StatMenuTypes.ALL_TIME:
        return cards;
      case StatMenuTypes.TODAY:
        return moment().isSame(date, `day`);
      case StatMenuTypes.WEEK:
        return moment().isSame(date, `week`);
      case StatMenuTypes.MONTH:
        return moment().isSame(date, `month`);
      case StatMenuTypes.YEAR:
        return moment().isSame(date, `year`);
    }

    return cards;
  });
};

const getUniqItems = (item, index, array) => {
  return array.indexOf(item) === index;
};

const calcUniqueGenres = (cards, genre) => {
  return cards.filter((it) => it === genre).length;
};

const getGenresByCard = (cards) => {
  return cards.reduce((prev, next) => {
    return [...prev, ...next.genre];
  }, []);
};

const getUniqueGenres = (cards) => {
  return getGenresByCard(cards).filter(getUniqItems);
};

const getTopGenre = (genres, cards) => {
  const arr = genres.map((it) => calcUniqueGenres(getGenresByCard(cards), it));
  const max = Math.max(...arr);

  return genres[arr.indexOf(max)];
};

const renderChart = (statisticCtx, cards) => {
  const BAR_HEIGHT = 50;

  statisticCtx.height = BAR_HEIGHT * 5;

  const genres = getUniqueGenres(cards);

  return new Chart(statisticCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: genres,
      datasets: [{
        data: genres.map((it) => calcUniqueGenres(getGenresByCard(cards), it)),
        backgroundColor: `#ffe800`,
        hoverBackgroundColor: `#ffe800`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 20
          },
          color: `#ffffff`,
          anchor: `start`,
          align: `start`,
          offset: 40,
        }
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#ffffff`,
            padding: 100,
            fontSize: 20
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 24
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false
      }
    }
  });
};

const createButtonMarkup = (filter, isChecked) => {
  return (
    `<input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-${filter.value}" value="${filter.value}" ${isChecked ? `checked` : ``}>
    <label for="statistic-${filter.value}" class="statistic__filters-label">${filter.title}</label>`
  );
};

const createTemplate = (cards, filter) => {
  const moviesCount = cards.filter((it) => it.isWatched).length;
  const moviesTotalDuration = cards.reduce((prev, next) => {
    return (prev += next.duration);
  }, 0);

  const topGenre = getTopGenre(getUniqueGenres(cards), cards);
  const hours = Math.trunc(moviesTotalDuration / MINUTES_IN_HOUR);
  const minutes = moviesTotalDuration % MINUTES_IN_HOUR;

  const menues = Object.values(StatMenuTypes).map((menuType) => {
    return {
      title: menuType.replace(`-`, ` `)[0].toUpperCase() + menuType.replace(`-`, ` `).slice(1),
      value: menuType,
      checked: menuType === filter,
    };
  });

  const menuesMarkup = menues.map((it) => createButtonMarkup(it, it.checked)).join(`\n`);

  return (
    `<section class="statistic">
    <p class="statistic__rank">
      Your rank
      <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      <span class="statistic__rank-label">Sci-Fighter</span>
    </p>

    <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
      <p class="statistic__filters-description">Show stats:</p>
      ${menuesMarkup}
    </form>

    <ul class="statistic__text-list">
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">You watched</h4>
        <p class="statistic__item-text">${moviesCount} <span class="statistic__item-description">movies</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Total duration</h4>
        <p class="statistic__item-text">${hours} <span class="statistic__item-description">h</span> ${minutes} <span class="statistic__item-description">m</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Top genre</h4>
        <p class="statistic__item-text">${topGenre}</p>
      </li>
    </ul>

    <div class="statistic__chart-wrap">
      <canvas class="statistic__chart" width="1000"></canvas>
    </div>

  </section>`
  );
};

export default class Statistics extends AbstractSmartComponent {
  constructor(cards) {
    super();

    this._cards = cards;

    this._activeFilter = StatMenuTypes.ALL_TIME;

    this.isOpen = false;
    this._chart = null;

    this._renderCharts();
  }

  getTemplate() {
    return createTemplate(getFilteredCards(this._cards.getCards(), this._activeFilter), this._activeFilter);
  }

  rerender(cards) {
    this._cards = cards;

    super.rerender();

    this._renderCharts();
  }

  _renderCharts() {
    const element = this.getElement();

    const statisticCtx = element.querySelector(`.statistic__chart`);

    this._resetCharts();

    this._chart = renderChart(statisticCtx, getFilteredCards(this._cards.getCards(), this._activeFilter));
    this._setClickMenuHandler();
  }

  _resetCharts() {
    if (this._chart) {
      this._chart.destroy();
      this._chart = null;
    }
  }

  recoveryListeners() {
    this._setClickMenuHandler();
  }

  _setClickMenuHandler() {
    const menuButtons = Array.from(this.getElement().querySelectorAll(`.statistic__filters-input`));

    menuButtons.forEach((it) => {
      it.addEventListener(`change`, (evt) => {
        this._activeFilter = evt.target.value;
        this.rerender(this._cards);
      });
    });
  }
}
