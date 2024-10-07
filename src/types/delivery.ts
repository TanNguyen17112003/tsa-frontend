import { OrderDetail } from './order';
import { initialOrderList } from './order';

type DeliveryStatus = 'PENDING' | 'ACCEPTED' | 'SUCCESS';
export interface Delivery {
  id: string;
  createdAt: string;
  acceptedAt?: string;
  deliveryAt?: string;
  limitTime: number;
  delayTime?: number;
  status: DeliveryStatus;
  orders: OrderDetail[];
  shipperId: string;
}

export interface DeliveryDetail extends Delivery {}

export const initialDeliveryList: Delivery[] = [];

const getRandomDate = (start: Date, end: Date): Date => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

const getRandomValueInRange = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const toUnixTimestamp = (date: Date): string => {
  return Math.floor(date.getTime() / 1000).toString();
};

const generateDeliveryList = (length: number): Delivery[] => {
  for (let i = 0; i < length; i++) {
    const createdAtDate = getRandomDate(new Date(2022, 0, 1), new Date(2022, 11, 31));
    const deliveryAtDate = new Date(createdAtDate);
    deliveryAtDate.setDate(createdAtDate.getDate() + 1);

    const delivery: Delivery = {
      id: i.toString(),
      createdAt: toUnixTimestamp(createdAtDate),
      deliveryAt: toUnixTimestamp(deliveryAtDate),
      delayTime: getRandomValueInRange(3, 5),
      limitTime: getRandomValueInRange(10, 20),
      status: getRandomDeliveryStatus(),
      orders: initialOrderList,
      shipperId: i.toString()
    };

    initialDeliveryList.push(delivery);
  }
  return initialDeliveryList;
};

const getRandomDeliveryStatus = (): DeliveryStatus => {
  const statuses: DeliveryStatus[] = ['SUCCESS', 'ACCEPTED', 'PENDING'];
  return statuses[Math.floor(Math.random() * statuses.length)];
};

generateDeliveryList(20);
console.log(initialDeliveryList);
