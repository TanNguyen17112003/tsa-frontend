export type TicketStatus = 'PENDING' | 'PROCESSING' | 'REPLIED' | 'CLOSED';

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
  'Đang mở': 'PENDING',
  'Đang trao đổi': 'PROCESSING',
  'Đã trả lời': 'REPLIED',
  'Đã hoàn thành': 'CLOSED'
};

export interface Ticket {
  id: string;
  categoryId: string;
  title: string;
  content: string;
  status: TicketStatus;
  createdAt: Date | string;
  studentId: string;
  attachments: TicketAttachment[];
  replies: TicketReply[];
}

export interface TicketDetail extends Ticket {}

export interface TicketReply {
  id: string;
  userId: string;
  content: string;
  createdAt: Date | string;
  attachments: TicketAttachment[];
}

export interface TicketAttachment {
  fileUrl: string;
  uploadedAt: Date | string;
}
