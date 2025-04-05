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
      | 'shippingFee'
      | 'isPaid'
      | 'brand'
    > & {
      deliveryDay: string;
      deliveryTimeSlot: string;
    }
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

export interface ShippingFeeRequest {
  room: string;
  building: string;
  dormitory: string;
  weight: number;
}

export class OrdersApi {
  static async postOrders(request: OrderFormProps): Promise<OrderCreateResponse> {
    return await apiPost('/orders', request);
  }
  static async getOrders(request: any): Promise<OrderResponse> {
    const response = await apiGet('/orders', request);
    return response;
  }

  static async getShippingFee(request: ShippingFeeRequest): Promise<number> {
    return await apiPost(
      `/orders/shipping-fee?room=${request.room}&building=${request.building}&dormitory=${request.dormitory}&weight=${request.weight}`,
      {}
    );
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
