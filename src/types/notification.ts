export type NotificationType = 'ORDER' | 'DELIVERY' | 'REPORT';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  content: string;
  createdAt: string;
  orderId?: string;
  deliveryId?: string;
  reportId?: string;
  userId: string;
  isRead: boolean;
}

export interface NotificationDetail extends Notification {}
