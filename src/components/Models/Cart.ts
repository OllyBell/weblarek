import { IProduct } from '../../types';
import { IEvents } from '../base/Events';
import { AppEvents } from '../../utils/events';

//Корзина: хранит товары, выбранные для покупки
export class Cart {
  private items: IProduct[] = [];

  constructor(protected events: IEvents) {}

  getItems(): IProduct[] {
    return this.items;
  }

  add(product: IProduct): void {
    if (!this.has(product.id)) {
      this.items.push(product);
      this.events.emit(AppEvents.cartChanged);
    }
  }

  remove(id: string): void {
    this.items = this.items.filter((item) => item.id !== id);
    this.events.emit(AppEvents.cartChanged);
  }

  clear(): void {
    this.items = [];
    this.events.emit(AppEvents.cartChanged);
  }

  getTotal(): number {
    return this.items.reduce((sum, item) => sum + (item.price ?? 0), 0);
  }

  getCount(): number {
    return this.items.length;
  }

  has(id: string): boolean {
    return this.items.some((item) => item.id === id);
  }
}
