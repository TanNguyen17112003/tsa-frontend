type PaymentMethod = 'AT_DELIVERY' | 'MOMO' | 'BANK';
type OrderStatus = 'CANCELLED' | 'DELIVERED' | 'PENDING' | 'REJECTED' | 'IN_TRANSPORT' | 'REJECTED';

export interface Order {
  id: string; // uuid
  checkCode: string;
  product: string[];
  room: string;
  building: string;
  dormitory: string;
  deliveryDate: string;
  shippingFee: number;
  paymentMethod: PaymentMethod;
  isPaid: boolean;
  studentId?: string;
  adminId?: string;
  shipperId?: string;
  deliveryId?: string;
  ordinalNumber?: string;
  weight?: number;
  status: OrderStatusHistory[];
  latestStatus: OrderStatus;
}

interface OrderStatusHistory {
  id: string;
  orderId: Order['id'];
  status: OrderStatus;
  reason?: string;
}

export interface OrderDetail extends Order {
  brand?: string;
}

export interface StudentOrderImport extends Order {}

export interface OrderImport extends Omit<Order, 'id'> {}

export const initialAddingOrder: OrderImport = {
  checkCode: '',
  product: [],
  room: '',
  building: '',
  dormitory: '',
  deliveryDate: '',
  paymentMethod: 'AT_DELIVERY',
  shippingFee: 0,
  isPaid: false,
  status: [
    {
      id: '',
      orderId: '',
      status: 'PENDING'
    }
  ],
  latestStatus: 'PENDING'
};

export const orderStatusMap = {
  'Đã giao': 'DELIVERED',
  'Đang giao': 'IN_TRANSPORT',
  'Đang chờ xử lý': 'PENDING',
  'Đã hủy': 'CANCELLED',
  'Đã từ chối': 'REJECTED',
  'Đã xác nhận': 'ACCEPTED'
};
