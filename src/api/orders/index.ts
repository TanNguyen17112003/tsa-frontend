import { apiDelete, apiGet, apiPatch, apiPost, apiPut, getFormData } from 'src/utils/api-request';
import { OrderDetail, Order, OrderStatus } from 'src/types/order';

export interface OrderFormProps
  extends Partial<
    Pick<
      OrderDetail,
      | 'checkCode'
      | 'weight'
      | 'building'
      | 'phone'
      | 'deliveryDate'
      | 'dormitory'
      | 'paymentMethod'
      | 'product'
      | 'room'
    >
  > {
  studentId?: string;
  adminId?: string;
}

interface OrderCreateResponse {
  message: string;
  data: OrderDetail;
}

export interface OrderResponse {
  totalElements: number;
  totalPages: number;
  results: OrderDetail[];
}

export class OrdersApi {
  static async postOrders(request: OrderFormProps): Promise<OrderCreateResponse> {
    return await apiPost('/orders', request);
  }
  static async getOrders(request: {}): Promise<OrderResponse> {
    const response = await apiGet('/orders', getFormData(request));
    return response;
  }

  static async getOrderById(id: Order['id']): Promise<OrderDetail> {
    return await apiGet(`/orders/${id}`);
  }
  static async updateOrder(request: Partial<Order>, orderId: string): Promise<OrderCreateResponse> {
    return await apiPatch('/orders/' + orderId, request);
  }

  static async updateOrderStatus(status: OrderStatus, id: string): Promise<OrderDetail> {
    return await apiPatch('/orders/status/' + id, { status });
  }

  static async deleteOrder(id: Order['id']) {
    return await apiDelete(`/orders/${id}`, {});
  }
}
