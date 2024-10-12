import { OrderFormProps } from 'src/api/orders';
import { AddressData } from '@utils';

type PaymentMethod = 'CASH' | 'MOMO' | 'CREDIT';
export type OrderStatus =
  | 'CANCELLED'
  | 'DELIVERED'
  | 'PENDING'
  | 'REJECTED'
  | 'IN_TRANSPORT'
  | 'REJECTED';

interface OrderStatusHistory {
  id: string;
  orderId: string;
  reason?: string;
  time: string;
  status: OrderStatus;
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
}

export const initialOrderList: Order[] = [];

const getRandomOrderStatus = (): OrderStatus => {
  const statuses: OrderStatus[] = ['CANCELLED', 'DELIVERED', 'PENDING', 'REJECTED', 'IN_TRANSPORT'];
  return statuses[Math.floor(Math.random() * statuses.length)];
};

const getRandomPaymentMethod = (): PaymentMethod => {
  const methods: PaymentMethod[] = ['CASH', 'MOMO', 'CREDIT'];
  return methods[Math.floor(Math.random() * methods.length)];
};

const getRandomElement = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

const generateOrdersForMonth = (year: number, month: number) => {
  const daysInMonth = new Date(year, month, 0).getDate();

  for (let day = 1; day <= daysInMonth; day++) {
    const dayString = day.toString().padStart(2, '0');
    const randomShippingFee = Math.floor(Math.random() * 10000) + 1000;
    const date = new Date(`${year}-${month.toString().padStart(2, '0')}-${dayString}T00:00:00Z`);
    const unixTimestamp = Math.floor(date.getTime() / 1000);
    const randomIsPaid = Math.random() > 0.5 ? true : false;

    const dormitory = getRandomElement(AddressData.dormitories);
    const building = getRandomElement(
      AddressData.buildings[dormitory as keyof typeof AddressData.buildings]
    );
    const room = getRandomElement(AddressData.rooms);

    initialOrderList.push({
      id: `${year}-${month}-${day}`,
      checkCode: (123456 + initialOrderList.length).toString(),
      product: 'Bánh mì',
      room,
      building,
      dormitory,
      weight: 2,
      deliveryDate: unixTimestamp.toString(),
      shippingFee: randomShippingFee,
      paymentMethod: getRandomPaymentMethod(),
      isPaid: randomIsPaid,
      latestStatus: getRandomOrderStatus(),
      historyTime: [
        {
          id: `${year}-${month}-${day}`,
          orderId: `${year}-${month}-${day}`,
          time: unixTimestamp.toString(),
          status: 'PENDING'
        }
      ]
    });
  }
};

for (let month = 1; month <= 12; month++) {
  generateOrdersForMonth(2024, month);
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
