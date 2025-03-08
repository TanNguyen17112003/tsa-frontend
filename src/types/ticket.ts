export type TicketStatus = 'open' | 'closed' | 'in-progress';

export type TicketType =
  | 'Payment and Fee'
  | 'Order Registration and Tracking'
  | 'Delivery and Shipping'
  | 'Return and Refund'
  | 'Product and Stock'
  | 'System and Account';

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
