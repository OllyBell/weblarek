import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { settings } from '../../utils/constants';
import { TCard } from '../../types';

/**
 * Базовый класс карточки товара.
 * Общее для всех вариантов карточки: название и цена.
 * Создавать экземпляр напрямую нельзя — класс абстрактный.
 */
export abstract class Card<T extends TCard> extends Component<T> {
    // Название и цена есть во всех трёх шаблонах
    protected titleEl: HTMLElement;
    protected priceEl: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);

        this.titleEl = ensureElement<HTMLElement>('.card__title', container);
        this.priceEl = ensureElement<HTMLElement>('.card__price', container);
    }

    set title(value: string) {
        this.titleEl.textContent = value;
    }

    set price(value: number | null) {
        this.priceEl.textContent = this.formatPrice(value);
    }

    /**
     * Форматирует цену в строку для вывода.
     * Если цена отсутствует (null), показывается «Бесценно»
     */
    protected formatPrice(value: number | null): string {
        if (value === null) {
            return settings.noPriceText;
        }
        return `${value} ${settings.currencyName}`;
    }
}
