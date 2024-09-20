type PaymentMethod = 'AT_DELIVERY' | 'MOMO' | 'BANK';
type OrderStatus = 'CANCELLED' | 'DELIVERED' | 'PENDING' | 'REJECTED' | 'IN_TRANSPORT' | 'REJECTED';

export interface Order {
  id: string; // uuid
  checkCode: string;
  product: string[];
  address: string;
  deliveryDate: string;
  shippingFee: number;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  isPaid: boolean;
  studentId?: string;
  adminId?: string;
  shipperId?: string;
  createdAt?: string;
  deliveredAt?: string;
  cancelledAt?: string;
  rejectedAt?: string;
  acceptedAt?: string;
  deliveryId?: string;
  ordinalNumber?: string;
  weight?: number;
  rejectReason?: string;
  cancelReason?: string;
  building?: string;
  room?: string;
}

export interface OrderDetail extends Order {
  brand?: string;
}

export interface StudentOrderImport extends Order {}

export interface OrderImport
  extends Pick<Order, 'checkCode' | 'product' | 'address' | 'deliveryDate' | 'paymentMethod'> {}

export const initialAddingOrder: OrderImport = {
  checkCode: '',
  product: [],
  address: '',
  deliveryDate: '',
  paymentMethod: 'AT_DELIVERY'
};

export const initialOrderList: OrderDetail[] = [
  {
    id: '1',
    checkCode: '1',
    product: ['Mũ'],
    address: 'R.312, D.A20',
    deliveryDate: '2024-09-05',
    shippingFee: 5000,
    paymentMethod: 'BANK',
    status: 'DELIVERED',
    isPaid: true
  },
  {
    id: '2',
    checkCode: '2',
    product: ['Mũ'],
    address: 'R.312, D.A20',
    deliveryDate: '2024-09-05',
    shippingFee: 5000,
    paymentMethod: 'BANK',
    status: 'DELIVERED',
    isPaid: true
  },
  {
    id: '3',
    checkCode: '3',
    product: ['Mũ'],
    address: 'R.312, D.A20',
    deliveryDate: '2024-09-05',
    shippingFee: 5000,
    paymentMethod: 'BANK',
    status: 'DELIVERED',
    isPaid: false
  },
  {
    id: '4',
    checkCode: '4',
    product: ['Mũ'],
    address: 'R.312, D.A20',
    deliveryDate: '2024-09-05',
    shippingFee: 5000,
    paymentMethod: 'BANK',
    status: 'DELIVERED',
    isPaid: false
  },
  {
    id: '5',
    checkCode: '5',
    product: ['Mũ'],
    address: 'R.312, D.A20',
    deliveryDate: '2024-09-05',
    shippingFee: 5000,
    paymentMethod: 'BANK',
    status: 'CANCELLED',
    isPaid: true
  },
  {
    id: '6',
    checkCode: '6',
    product: ['Mũ'],
    address: 'R.312, D.A20',
    deliveryDate: '2024-09-05',
    shippingFee: 5000,
    paymentMethod: 'BANK',
    status: 'CANCELLED',
    isPaid: false
  },
  {
    id: '7',
    checkCode: '7',
    product: ['Mũ'],
    address: 'R.312, D.A20',
    deliveryDate: '2024-09-05',
    shippingFee: 5000,
    paymentMethod: 'BANK',
    status: 'PENDING',
    isPaid: true
  },
  {
    id: '8',
    checkCode: '8',
    product: ['Mũ'],
    address: 'R.312, D.A20',
    deliveryDate: '2024-09-05',
    shippingFee: 5000,
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
