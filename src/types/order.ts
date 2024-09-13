type PaymentMethod = 'AT_DELIVERY' | 'MOMO' | 'BANK';
type OrderStatus = 'CANCELLED' | 'DELIVERED' | 'PENDING' | 'REJECTED' | 'IN_TRANSPORT' | 'REJECTED';

export interface Order {
  id: string; // uuid
  code: string;
  product: string[];
  address: string;
  deliveryDate: string;
  amount: number;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  isPaid: boolean;
}

export interface OrderDetail extends Order {
  brand?: string;
}

export interface StudentOrderImport extends Order {}

export interface OrderImport
  extends Pick<Order, 'code' | 'product' | 'address' | 'deliveryDate' | 'paymentMethod'> {}

export const initialAddingOrder: OrderImport = {
  code: '',
  product: [],
  address: '',
  deliveryDate: '',
  paymentMethod: 'AT_DELIVERY'
};

export const initialOrderList: OrderDetail[] = [
  {
    id: '20462',
    code: '20462',
    product: ['Mũ'],
    address: 'R.312, D.A20',
    deliveryDate: '2024-09-05',
    amount: 5000,
    paymentMethod: 'BANK',
    status: 'DELIVERED',
    isPaid: true
  },
  {
    id: '20462',
    code: '20462',
    product: ['Mũ'],
    address: 'R.312, D.A20',
    deliveryDate: '2024-09-05',
    amount: 5000,
    paymentMethod: 'BANK',
    status: 'DELIVERED',
    isPaid: true
  },
  {
    id: '20462',
    code: '20462',
    product: ['Mũ'],
    address: 'R.312, D.A20',
    deliveryDate: '2024-09-05',
    amount: 5000,
    paymentMethod: 'BANK',
    status: 'DELIVERED',
    isPaid: false
  },
  {
    id: '20462',
    code: '20462',
    product: ['Mũ'],
    address: 'R.312, D.A20',
    deliveryDate: '2024-09-05',
    amount: 5000,
    paymentMethod: 'BANK',
    status: 'DELIVERED',
    isPaid: false
  },
  {
    id: '20462',
    code: '20462',
    product: ['Mũ'],
    address: 'R.312, D.A20',
    deliveryDate: '2024-09-05',
    amount: 5000,
    paymentMethod: 'BANK',
    status: 'CANCELLED',
    isPaid: true
  },
  {
    id: '20462',
    code: '20462',
    product: ['Mũ'],
    address: 'R.312, D.A20',
    deliveryDate: '2024-09-05',
    amount: 5000,
    paymentMethod: 'BANK',
    status: 'CANCELLED',
    isPaid: false
  },
  {
    id: '20462',
    code: '20462',
    product: ['Mũ'],
    address: 'R.312, D.A20',
    deliveryDate: '2024-09-05',
    amount: 5000,
    paymentMethod: 'BANK',
    status: 'PENDING',
    isPaid: true
  },
  {
    id: '20462',
    code: '20462',
    product: ['Mũ'],
    address: 'R.312, D.A20',
    deliveryDate: '2024-09-05',
    amount: 5000,
    paymentMethod: 'BANK',
    status: 'PENDING',
    isPaid: false
  }
];

export const orderStatusMap = {
  'Đã giao': 'DELIVERED',
  'Đang giao': 'IN_TRANSPORT',
  'Đang chờ xử lý': 'PENDING',
  'Đã hủy': 'CANCELLED',
  'Đã từ chối': 'REJECTED'
};
