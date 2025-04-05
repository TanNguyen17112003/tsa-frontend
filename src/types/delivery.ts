import { OrderDetail } from './order';

export type DeliveryStatus = 'PENDING' | 'ACCEPTED' | 'FINISHED' | 'CANCELED';

export interface AdvancedDelivery {
  delayed: Partial<OrderDetail>[];
  deliveries: Partial<OrderDetail>[][];
}

export const deliveryStatusMap = {
  'Đang chờ xử lý': 'PENDING',
  'Đã chấp nhận': 'ACCEPTED',
  'Đã hoàn thành': 'FINISHED',
  'Đã hủy': 'CANCELED'
};

interface DeliveryStatusHistory {
  id: string;
  deliveryId: string;
  status: DeliveryStatus;
  reason?: string;
  time: string;
}
export interface Delivery {
  id: string;
  createdAt: string;
  acceptedAt?: string;
  deliveryAt?: string;
  limitTime: number;
  delayTime?: number;
  latestStatus: DeliveryStatus;
  numberOrder: number;
  orders: OrderDetail[];
  staffId: string;
  DeliveryStatusHistory: DeliveryStatusHistory[];
}

export interface DeliveryDetail extends Delivery {}

export const initialDeliveryList: Delivery[] = [];
