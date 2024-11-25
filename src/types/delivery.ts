import { OrderDetail } from './order';

export type DeliveryStatus = 'PENDING' | 'ACCEPTED' | 'FINISHED' | 'CANCELED';

export const deliveryStatusMap = {
  'Đang chờ xử lý': 'PENDING',
  'Đã chấp nhận': 'ACCEPTED',
  'Đã hoàn thành': 'FINISHED',
  'Đã hủy': 'CANCELED'
};
export interface Delivery {
  id: string;
  createdAt: string;
  acceptedAt?: string;
  deliveryAt?: string;
  limitTime: number;
  delayTime?: number;
  status: DeliveryStatus;
  orders: OrderDetail[];
  staffId: string;
}

export interface DeliveryDetail extends Delivery {}

export const initialDeliveryList: Delivery[] = [];
