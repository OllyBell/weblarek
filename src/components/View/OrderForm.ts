import { Form } from './Form';
import { IEvents } from '../base/Events';
import { TFormChange, TOrderForm, TPayment } from '../../types';
import { ensureElement } from '../../utils/utils';
import { settings } from '../../utils/constants';
import { AppEvents } from '../../utils/events';

/**
 * Первая часть оформления: способ оплаты и адрес доставки
 */
export class OrderForm extends Form<TOrderForm> {
    protected cardButton: HTMLButtonElement;
    protected cashButton: HTMLButtonElement;
    protected addressInput: HTMLInputElement;

    constructor(events: IEvents, container: HTMLFormElement) {
        super(events, AppEvents.orderSubmit, container);

        this.cardButton = ensureElement<HTMLButtonElement>('button[name="card"]', container);
        this.cashButton = ensureElement<HTMLButtonElement>('button[name="cash"]', container);
        this.addressInput = ensureElement<HTMLInputElement>('input[name="address"]', container);

        this.cardButton.addEventListener('click', () => {
            this.events.emit<TFormChange>(AppEvents.orderChange, { payment: 'card' });
        });

        this.cashButton.addEventListener('click', () => {
            this.events.emit<TFormChange>(AppEvents.orderChange, { payment: 'cash' });
        });

        this.addressInput.addEventListener('input', () => {
            this.events.emit<TFormChange>(AppEvents.orderChange, { address: this.addressInput.value });
        });
    }

    set payment(value: TPayment | null) {
        this.cardButton.classList.toggle(settings.paymentActiveClassName, value === 'card');
        this.cashButton.classList.toggle(settings.paymentActiveClassName, value === 'cash');
    }

    set address(value: string) {
        this.addressInput.value = value;
    }
}
