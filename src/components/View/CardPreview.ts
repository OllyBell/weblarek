import { Card } from './Card';
import { IEvents } from '../base/Events';
import { TCardPreview } from '../../types';
import { ensureElement } from '../../utils/utils';
import { categoryMap, CDN_URL } from '../../utils/constants';
import { AppEvents } from '../../utils/events';

// Карточка для более подробного просмотра
export class CardPreview extends Card<TCardPreview> {
    protected categoryEl: HTMLElement;
    protected imageEl: HTMLImageElement;
    protected descriptionEl: HTMLElement;
    protected buttonEl: HTMLButtonElement;

    constructor(protected events: IEvents, container: HTMLElement) {
        super(container);

        this.categoryEl = ensureElement<HTMLElement>('.card__category', container);
        this.imageEl = ensureElement<HTMLImageElement>('.card__image', container);
        this.descriptionEl = ensureElement<HTMLElement>('.card__text', container);
        this.buttonEl = ensureElement<HTMLButtonElement>('.card__button', container);

        this.buttonEl.addEventListener('click', () => {
            this.events.emit(AppEvents.cardAction);
        });
    }

    set category(value: string) {
        this.categoryEl.textContent = value;
        for (const [name, className] of Object.entries(categoryMap)) {
            this.categoryEl.classList.toggle(className, name === value);
        }
    }

    set image(value: string) {
        this.setImage(this.imageEl, `${CDN_URL}/${value}`);
    }

    set description(value: string) {
        this.descriptionEl.textContent = value;
    }

    set buttonText(value: string) {
        this.buttonEl.textContent = value;
    }

    set buttonDisabled(value: boolean) {
        this.buttonEl.disabled = value;
    }
}
