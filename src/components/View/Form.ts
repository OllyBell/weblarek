import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { IForm } from '../../types';
import { ensureElement } from '../../utils/utils';


/**
 * Родительский класс форм: кнопка отправки, ошибки и отправка формы.
 * Имя события отправки передаёт наследник — из словаря AppEvents.
 */
export abstract class Form<T extends IForm> extends Component<T> {
    protected submitButton: HTMLButtonElement;
    protected errorsEl: HTMLElement;

    constructor(protected events: IEvents, protected submitEvent: string, container: HTMLFormElement) {
        super(container);

        this.submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', container);
        this.errorsEl = ensureElement<HTMLElement>('.form__errors', container);

        container.addEventListener('submit', (event) => {
            event.preventDefault();
            this.events.emit(this.submitEvent);
        });
    }

    set valid(value: boolean) {
        this.submitButton.disabled = !value;
    }

    set errors(value: string) {
        this.errorsEl.textContent = value;
    }
}
