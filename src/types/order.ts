import { OrderFormProps } from 'src/api/orders';
import { CloseCircle, TickCircle, Truck, UserTick, MessageQuestion } from 'iconsax-react';
import React from 'react';

type PaymentMethod = 'CASH' | 'MOMO' | 'CREDIT';
export type OrderStatus =
  | 'CANCELLED'
  | 'DELIVERED'
  | 'PENDING'
  | 'REJECTED'
  | 'IN_TRANSPORT'
  | 'ACCEPTED';

export const orderStatusIconList = [
  {
    status: 'CANCELLED',
    icon: React.createElement(CloseCircle),
    color: 'red',
    title: 'Bị hủy'
  },
  {
    status: 'DELIVERED',
    icon: React.createElement(TickCircle),
    color: 'green',
    title: 'Đã giao'
  },
  {
    status: 'ACCEPTED',
    icon: React.createElement(UserTick),
    color: 'green',
    title: 'Đã xác nhận'
  },
  {
    status: 'REJECTED',
    icon: React.createElement(CloseCircle),
    color: 'red',
    title: 'Đã từ chối'
  },
  {
    status: 'PENDING',
    icon: React.createElement(MessageQuestion),
    color: 'orange',
    title: 'Đang chờ xử lý'
  },
  {
    status: 'IN_TRANSPORT',
    icon: React.createElement(Truck),
    color: 'blue',
    title: 'Đang giao'
  }
];

interface OrderStatusHistory {
  id: string;
  orderId: string;
  reason?: string;
  time: string;
  status: OrderStatus;
  cancelImage: string;
}

export interface Order {
  id: string;
  checkCode: string;
  product: string;
  room: string;
  building: string;
  dormitory: string;
  deliveryDate: string;
  shippingFee: number;
  remainingAmount: number;
  paymentMethod: PaymentMethod;
  isPaid: boolean;
  studentId?: string;
  adminId?: string;
  shipperId?: string;
  deliveryId?: string;
  ordinalNumber?: string;
  weight?: number;
  latestStatus: OrderStatus;
  phone?: string;
  createdTime?: string;
  historyTime: OrderStatusHistory[];
  staffInfo: {
    lastName?: string;
    firstName?: string;
    phoneNumber?: string;
    photoUrl?: string;
  };
  finishedImage: string;
}

export interface OrderDetail extends Order {
  brand?: string;
}

export const initialOrderForm: OrderFormProps = {
  checkCode: '',
  product: '',
  room: '',
  building: '',
  dormitory: '',
  deliveryDate: '',
  paymentMethod: 'CASH',
  weight: 0
};

export const adminInitialOrderForm: OrderFormProps = {
  checkCode: '',
  product: '',
  weight: 0
};

export const orderStatusMap = {
  'Đã giao': 'DELIVERED',
  'Đang giao': 'IN_TRANSPORT',
  'Đang chờ xử lý': 'PENDING',
  'Đã hủy': 'CANCELLED',
  'Đã từ chối': 'REJECTED',
  'Đã xác nhận': 'ACCEPTED'
};
