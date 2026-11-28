import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { IHeader } from '../../types';
import { ensureElement } from '../../utils/utils';
import { AppEvents } from '../../utils/events';

/**
 * Шапка страницы: кнопка корзины и счётчик товаров
 */
export class Header extends Component<IHeader> {
    protected cartButton: HTMLButtonElement;
    protected counterEl: HTMLElement;

    constructor(protected events: IEvents, container: HTMLElement) {
        super(container);

        this.cartButton = ensureElement<HTMLButtonElement>('.header__basket', container);
        this.counterEl = ensureElement<HTMLElement>('.header__basket-counter', container);

        this.cartButton.addEventListener('click', () => {
            this.events.emit(AppEvents.cartOpen);
        });
    }

    set counter(value: number) {
        this.counterEl.textContent = String(value);
    }
}
