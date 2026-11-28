import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ISuccess } from '../../types';
import { ensureElement } from '../../utils/utils';
import { settings } from '../../utils/constants';
import { AppEvents } from '../../utils/events';

//Сообщение об успешном оформлении заказа. Шаблон #success.
export class Success extends Component<ISuccess> {
    protected descriptionEl: HTMLElement;
    protected closeButton: HTMLButtonElement;

    constructor(protected events: IEvents, container: HTMLElement) {
        super(container);

        this.descriptionEl = ensureElement<HTMLElement>('.order-success__description', container);
        this.closeButton = ensureElement<HTMLButtonElement>('.order-success__close', container);

        this.closeButton.addEventListener('click', () => {
            this.events.emit(AppEvents.successClose);
        });
    }

    set total(value: number) {
        this.descriptionEl.textContent = `${settings.successMessage} ${value} ${settings.currencyName}`;
    }
}
