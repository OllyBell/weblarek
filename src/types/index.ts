export type ApiPostMethods = "POST" | "PUT" | "DELETE";

export interface IApi {
  get<T extends object>(uri: string): Promise<T>;
  post<T extends object>(
    uri: string,
    data: object,
    method?: ApiPostMethods,
  ): Promise<T>;
}

// Способ оплаты
export type TPayment = "card" | "cash";

// Товар
export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

//Покупатель
export interface IBuyer {
  payment: TPayment | null;
  email: string;
  phone: string;
  address: string;
}

// Ошибки валидации: ключ — имя поля IBuyer, значение — текст ошибки.
// Ключей может не быть, если поле валидно, поэтому все поля необязательные.
export type TBuyerErrors = Partial<Record<keyof IBuyer, string>>;

// Ответ сервера на GET /product/
export interface IProductsResponse {
  total: number;
  items: IProduct[];
}

// Данные, которые мы отправляем на POST /order/
export interface IOrder extends IBuyer {
  payment: TPayment;
  total: number;
  items: string[]; // массив id товаров из корзины
}

// Ответ сервера на POST /order/ — подтверждение покупки
export interface IOrderResult {
  id: string;
  total: number;
}
