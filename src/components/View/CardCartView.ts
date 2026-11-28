import { Card } from './Card';
import { IEvents } from '../base/Events';
import { TCardCart } from '../../types';
import { ensureElement } from '../../utils/utils';
import { AppEvents } from '../../utils/events';

/**
 * Карточка товара в корзине. Шаблон #card-cart.
 * Название и цена наследуются от базового класса,
 * дополнительно — порядковый номер и кнопка удаления.
 */
export class CardCart extends Card<TCardCart> {
    protected id: string = '';
    protected indexEl: HTMLElement;
    protected deleteButton: HTMLButtonElement;

    constructor(protected events: IEvents, container: HTMLElement) {
        super(container);

        this.indexEl = ensureElement<HTMLElement>('.basket__item-index', container);
        this.deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', container);

        this.deleteButton.addEventListener('click', () => {
            this.events.emit<{ id: string }>(AppEvents.cartDelete, { id: this.id });
        });
    }

    set index(value: number) {
        this.indexEl.textContent = String(value);
    }

    render(data: TCardCart): HTMLElement {
        this.id = data.id;
        return super.render(data);
    }
}
