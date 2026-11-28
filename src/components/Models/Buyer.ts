import { IBuyer, TBuyerErrors, TPayment } from '../../types';
import { IEvents } from '../base/Events';
import { AppEvents } from '../../utils/events';

//Покупатель: хранит и проверяет данные для оформления заказа
export class Buyer {
  private payment: TPayment | null = null;
  private address = '';
  private email = '';
  private phone = '';

  constructor(protected events: IEvents) {}

  // Сохраняет только переданные поля, остальные не меняются
  setData(data: Partial<IBuyer>): void {
    if (data.payment !== undefined) this.payment = data.payment;
    if (data.address !== undefined) this.address = data.address;
    if (data.email !== undefined) this.email = data.email;
    if (data.phone !== undefined) this.phone = data.phone;
    this.events.emit(AppEvents.buyerChanged);
  }

  getData(): IBuyer {
    return {
      payment: this.payment,
      address: this.address,
      email: this.email,
      phone: this.phone,
    };
  }

  clear(): void {
    this.payment = null;
    this.address = '';
    this.email = '';
    this.phone = '';
    this.events.emit(AppEvents.buyerChanged);
  }

  // Возвращает объект с ошибками; валидные поля в него не попадают
  validate(): TBuyerErrors {
    const errors: TBuyerErrors = {};

    if (!this.payment) errors.payment = 'Не выбран вид оплаты';
    if (!this.address.trim()) errors.address = 'Необходимо указать адрес';
    if (!this.email.trim()) errors.email = 'Укажите email';
    if (!this.phone.trim()) errors.phone = 'Укажите телефон';

    return errors;
  }
}
