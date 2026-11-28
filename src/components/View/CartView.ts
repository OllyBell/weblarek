import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ICart } from '../../types';
import { ensureElement } from '../../utils/utils';
import { settings } from '../../utils/constants';
import { AppEvents } from '../../utils/events';

/**
 * Содержимое корзины. Шаблон #cart.
 * Список товаров и сумма приходят из презентера,
 * кнопка «Оформить» только уведомляет брокера.
 */
export class CartView extends Component<ICart> {
    protected listEl: HTMLElement;
    protected totalEl: HTMLElement;
    protected orderButton: HTMLButtonElement;

    constructor(protected events: IEvents, container: HTMLElement) {
        super(container);

        this.listEl = ensureElement<HTMLElement>('.basket__list', container);
        this.totalEl = ensureElement<HTMLElement>('.basket__price', container);
        this.orderButton = ensureElement<HTMLButtonElement>('.basket__button', container);

        this.orderButton.addEventListener('click', () => {
            this.events.emit(AppEvents.orderOpen);
        });
    }

    set items(value: HTMLElement[]) {
        this.listEl.replaceChildren();

        if (value.length === 0) {
            const empty = document.createElement('p');
            empty.classList.add('basket__empty');
            empty.textContent = settings.emptyCartText;
            this.listEl.append(empty);
            return;
        }

        value.forEach((item) => this.listEl.append(item));
    }

    set total(value: number) {
        this.totalEl.textContent = `${value} ${settings.currencyName}`;
    }

    set buttonDisabled(value: boolean) {
        this.orderButton.disabled = value;
    }
}
