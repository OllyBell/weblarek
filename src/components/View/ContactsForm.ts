import { Form } from './Form';
import { IEvents } from '../base/Events';
import { TContactsForm, TFormChange } from '../../types';
import { ensureElement } from '../../utils/utils';
import { AppEvents } from '../../utils/events';

/**
 * Вторая часть оформления: почта и телефон
 */
export class ContactsForm extends Form<TContactsForm> {
    protected emailInput: HTMLInputElement;
    protected phoneInput: HTMLInputElement;

    constructor(events: IEvents, container: HTMLFormElement) {
        super(events, AppEvents.contactsSubmit, container);

        this.emailInput = ensureElement<HTMLInputElement>('input[name="email"]', container);
        this.phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', container);

        this.emailInput.addEventListener('input', () => {
            this.events.emit<TFormChange>(AppEvents.contactsChange, { email: this.emailInput.value });
        });

        this.phoneInput.addEventListener('input', () => {
            this.events.emit<TFormChange>(AppEvents.contactsChange, { phone: this.phoneInput.value });
        });
    }

    set email(value: string) {
        this.emailInput.value = value;
    }

    set phone(value: string) {
        this.phoneInput.value = value;
    }
}
