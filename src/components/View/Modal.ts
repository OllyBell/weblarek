import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { IModal } from '../../types';
import { ensureElement } from '../../utils/utils';
import { settings } from '../../utils/constants';
import { AppEvents } from '../../utils/events';

/**
 * Модальное окно: контейнер без дочерних классов.
 * Внутрь можно положить любой самостоятельный компонент.
 */
export class Modal extends Component<IModal> {
    protected closeButton: HTMLButtonElement;
    protected contentEl: HTMLElement;

    constructor(protected events: IEvents, container: HTMLElement) {
        super(container);

        this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);
        this.contentEl = ensureElement<HTMLElement>('.modal__content', container);

        this.closeButton.addEventListener('click', () => {
            this.events.emit(AppEvents.modalClose);
        });

        // Клик по затемнённой области вне .modal__container
        container.addEventListener('click', (event) => {
            if (event.target === container) {
                this.events.emit(AppEvents.modalClose);
            }
        });
    }

    set content(value: HTMLElement) {
        this.contentEl.replaceChildren(value);
    }

    get isOpen(): boolean {
        return this.container.classList.contains(settings.modalActiveClassName);
    }

    open(): void {
        this.container.classList.add(settings.modalActiveClassName);
    }

    close(): void {
        this.container.classList.remove(settings.modalActiveClassName);
        this.contentEl.replaceChildren();
    }
}
