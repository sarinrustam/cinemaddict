import {MenuTypes} from '@src/utils/common.js';
import {getFilterdCards} from '@src/utils/menu.js';
import {render, replace, RenderPosition} from '@src/utils/render.js';
import Menu from '@components/menu.js';

export default class MenuController {
  constructor(container, cardsModel, onStatClickChange) {
    this._container = container;
    this._cardsModel = cardsModel;

    this._activeMenuType = MenuTypes.ALL_MOVIES;

    this._menuComponent = null;
    this._onStatClickChange = onStatClickChange;

    this._onDataChange = this._onDataChange.bind(this);
    this._onMenuChange = this._onMenuChange.bind(this);

    this._cardsModel.setDataChangeHandler(this._onDataChange);
  }

  render() {
    const container = this._container;
    const allCards = this._cardsModel.getCardsAll();
    const menues = Object.values(MenuTypes).map((menuType) => {
      return {
        title: menuType.replace(`-`, ` `)[0].toUpperCase() + menuType.replace(`-`, ` `).slice(1),
        value: menuType,
        count: MenuTypes.ALL_MOVIES === menuType ? null : getFilterdCards(allCards, menuType).length,
        checked: menuType === this._activeMenuType,
      };
    });

    const oldComponent = this._menuComponent;

    this._menuComponent = new Menu(menues);
    this._menuComponent.setMenuTypeChangeHandler(this._onMenuChange);

    if (oldComponent) {
      replace(this._menuComponent, oldComponent);
    } else {
      render(container, this._menuComponent, RenderPosition.BEFOREEND);
    }

    this._menuComponent.setStatisticsClickHandler(this._onStatClickChange);
  }

  _onMenuChange(menuType) {
    this._cardsModel.setMenu(menuType);
    this._activeMenuType = menuType;
  }

  _onDataChange() {
    this.render();
  }
}
