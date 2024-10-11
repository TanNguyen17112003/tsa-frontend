import { apiDelete, apiGet, apiPatch, apiPost, apiPut, getFormData } from 'src/utils/api-request';
import { DeliveryDetail, Delivery, DeliveryStatus } from 'src/types/delivery';

export interface DeliveryRequest {
  limitTime: number;
  staffId: string;
  orderIds: string[];
}

export interface DeliveryCreateResponse {
  id: string;
  createdAt: number;
  limitTime: number;
  staffId: string;
}

export class DeliveriesApi {
  static async postDeliveries(request: DeliveryRequest): Promise<DeliveryCreateResponse> {
    return await apiPost('/deliveries', request);
  }
  static async getDeliveries(request: {}): Promise<DeliveryDetail[]> {
    const response = await apiGet('/deliveries', getFormData(request));
    return response;
  }

  static async getDeliveryById(id: Delivery['id']): Promise<DeliveryDetail> {
    return await apiGet(`/deliveries/${id}`);
  }
  static async updateDelivery(
    request: Partial<Delivery>,
    orderId: string
  ): Promise<DeliveryCreateResponse> {
    return await apiPatch('/deliveries/' + orderId, request);
  }

  static async updateDeliveryStatus(status: DeliveryStatus, id: string): Promise<DeliveryDetail> {
    return await apiPut('/deliveries/status' + id, status);
  }

  static async deleteDelivery(id: Delivery['id']) {
    return await apiDelete(`/orders/${id}`, {});
  }
}
