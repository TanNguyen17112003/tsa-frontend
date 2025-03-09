export type TicketStatus = 'open' | 'closed' | 'in-progress';

export type TicketType =
  | 'Payment and Fee'
  | 'Order Registration and Tracking'
  | 'Delivery and Shipping'
  | 'Return and Refund'
  | 'Product and Stock'
  | 'System and Account';

export const ticketTypeMap = {
  'Thanh toán và phí': 'Payment and Fee',
  'Đăng ký và theo dõi đơn hàng': 'Order Registration and Tracking',
  'Giao hàng và vận chuyển': 'Delivery and Shipping',
  'Trả hàng và hoàn tiền': 'Return and Refund',
  'Sản phẩm và kho hàng': 'Product and Stock',
  'Hệ thống và tài khoản': 'System and Account'
};

export const ticketStatusMap = {
  'Đang mở': 'open',
  'Đang trao đổi': 'in-progress',
  'Đã hoàn thành': 'closed'
};

export interface Ticket {
  id: string;
  type: TicketType;
  title: string;
  content: string;
  status: TicketStatus;
  createdAt: string;
  studentId: string;
}

export interface TicketDetail extends Ticket {}

export interface TicketReply {
  id: string;
  ticketId: string;
  userId: string;
  content: string;
  createdAt: string;
}

export interface TicketAttachment {
  id: string;
  ticketId: string;
  replyId?: string;
  filePath: string;
  uploadedAt: string;
}

const mockTickets: TicketDetail[] = [
  {
    id: '1',
    type: 'Payment and Fee',
    title: 'Issue with payment',
    content: 'I am unable to process the payment for my order.',
    status: 'open',
    createdAt: '2025-03-01T10:00:00Z',
    studentId: 'student1'
  },
  {
    id: '2',
    type: 'Order Registration and Tracking',
    title: 'Order not showing up',
    content: 'My recent order is not showing up in my account.',
    status: 'in-progress',
    createdAt: '2025-03-02T11:00:00Z',
    studentId: 'student2'
  },
  {
    id: '3',
    type: 'Delivery and Shipping',
    title: 'Delayed delivery',
    content: 'My order delivery is delayed by a week.',
    status: 'closed',
    createdAt: '2025-03-03T12:00:00Z',
    studentId: 'student3'
  }
];

const mockReplies: TicketReply[] = [
  {
    id: 'reply1',
    ticketId: '1',
    userId: 'support1',
    content: 'We are looking into your payment issue.',
    createdAt: '2025-03-01T12:00:00Z'
  },
  {
    id: 'reply2',
    ticketId: '2',
    userId: 'support2',
    content: 'We have escalated your order tracking issue to the relevant team.',
    createdAt: '2025-03-02T13:00:00Z'
  },
  {
    id: 'reply3',
    ticketId: '3',
    userId: 'support3',
    content: 'Your delivery issue has been resolved.',
    createdAt: '2025-03-03T14:00:00Z'
  }
];

const mockAttachments: TicketAttachment[] = [
  {
    id: 'attachment1',
    ticketId: '1',
    filePath: '/uploads/payment_issue.png',
    uploadedAt: '2025-03-01T10:30:00Z'
  },
  {
    id: 'attachment2',
    ticketId: '2',
    filePath: '/uploads/order_tracking_issue.png',
    uploadedAt: '2025-03-02T11:30:00Z'
  },
  {
    id: 'attachment3',
    ticketId: '3',
    filePath: '/uploads/delivery_issue.png',
    uploadedAt: '2025-03-03T12:30:00Z'
  }
];

export { mockTickets, mockReplies, mockAttachments };
