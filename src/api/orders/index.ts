import { apiDelete, apiGet, apiPatch, apiPost, apiPut, getFormData } from 'src/utils/api-request';
import { OrderDetail, Order } from 'src/types/order';

export class OrdersApi {
  static async postOrders(request: Partial<Omit<OrderDetail, 'id'>>): Promise<OrderDetail> {
    return await apiPost('/orders', request);
  }
  static async getOrders(request: {}): Promise<OrderDetail[]> {
    const response = await apiGet('/orders', getFormData(request));
    return response;
  }

  static async getOrderById(id: Order['id']): Promise<OrderDetail> {
    return await apiGet(`/orders/${id}`);
  }
  static async putOrder(request: Partial<Order & Pick<Order, 'id'>>): Promise<OrderDetail> {
    return await apiPatch('/orders/' + request.id, request);
  }

  static async deleteOrder(id: Order['id']) {
    return await apiDelete(`/orders/${id}`, {});
  }
}
