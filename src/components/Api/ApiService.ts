import { IApi, IProductsResponse, IOrder, IOrderResult } from '../../types';

export class ApiService {
  constructor(private api: IApi) {}

  getProducts(): Promise<IProductsResponse> {
    return this.api.get<IProductsResponse>('/product/');
  }

  sendOrder(orderData: IOrder): Promise<IOrderResult> {
    return this.api.post<IOrderResult>('/order/', orderData);
  }
}
