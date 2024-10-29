import { apiDelete, apiGet, apiPatch, apiPost, apiPut, getFormData } from 'src/utils/api-request';
import { Notification, NotificationDetail } from 'src/types/notification';

export interface NotificationFormProps
  extends Partial<
    Pick<
      Notification,
      'title' | 'content' | 'type' | 'userId' | 'reportId' | 'deliveryId' | 'orderId'
    >
  > {}

export class NotificationsApi {
  static async getNotifications(request: {}): Promise<NotificationDetail[]> {
    return await apiGet('/notifications', getFormData(request));
  }

  static async sendNotification(request: NotificationFormProps): Promise<NotificationDetail> {
    const response = await apiPost('/notifications', request);
    return response;
  }

  static async updateNotificationStatus(id: Notification['id']): Promise<NotificationDetail> {
    const response = await apiPatch(`/notifications/${id}`, {});
    return response;
  }
}
