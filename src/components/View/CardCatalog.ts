import { Card } from './Card';
import { IEvents } from '../base/Events';
import { TCardCatalog } from '../../types';
import { ensureElement } from '../../utils/utils';
import { categoryMap, CDN_URL } from '../../utils/constants';
import { AppEvents } from '../../utils/events';

/**
 * Карточка товара в каталоге. Шаблон #card-catalog.
 * Дополняет общие поля категорией и изображением.
 */
export class CardCatalog extends Card<TCardCatalog> {
    protected categoryEl: HTMLElement;
    protected imageEl: HTMLImageElement;
    protected id: string = '';

    constructor(protected events: IEvents, container: HTMLElement) {
        super(container);

        this.categoryEl = ensureElement<HTMLElement>('.card__category', container);
        this.imageEl = ensureElement<HTMLImageElement>('.card__image', container);

        // Корневой элемент шаблона — кнопка, поэтому слушаем клик на контейнере
        container.addEventListener('click', () => {
            this.events.emit<{ id: string }>(AppEvents.cardSelect, { id: this.id });
        });
    }

    set category(value: string) {
        this.categoryEl.textContent = value;
        // Выставляем модификатор совпавшей категории, остальные снимаем
        const entries = Object.entries(categoryMap) as [string, string][];
        for (const [name, className] of entries) {
            this.categoryEl.classList.toggle(className, name === value);
        }
    }

    set image(value: string) {
        this.setImage(this.imageEl, `${CDN_URL}/${value}`);
    }

    render(data: TCardCatalog): HTMLElement {
        this.id = data.id;
        return super.render(data);
    }
}
