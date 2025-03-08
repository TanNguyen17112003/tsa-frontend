import { apiDelete, apiGet, apiPatch, apiPost, apiPut, getFormData } from 'src/utils/api-request';
import {
  TicketDetail,
  TicketType,
  TicketReply,
  TicketStatus,
  TicketAttachment
} from 'src/types/ticket';

export interface TicketFormProps {
  title: string;
  content: string;
  type: TicketType;
}

export class TicketsApi {
  static async getListTicket(): Promise<TicketDetail[]> {
    return await apiGet('/tickets');
  }

  static async getDetailTicket(id: string): Promise<TicketDetail> {
    return await apiGet(`/tickets/${id}`);
  }

  static async createTicket(request: TicketFormProps, attachments?: File[]): Promise<TicketDetail> {
    const formData = getFormData(request);
    if (attachments) {
      attachments.forEach((file) => formData.append('attachments', file));
    }
    return await apiPost('/tickets', formData);
  }

  static async replyTicket(
    ticketId: string,
    reply: string,
    attachments?: File[]
  ): Promise<TicketReply> {
    const formData = new FormData();
    formData.append('content', reply);
    if (attachments) {
      attachments.forEach((file) => formData.append('attachments', file));
    }
    return await apiPost(`/tickets/${ticketId}/replies`, formData);
  }

  static async updateStatusTicket(ticketId: string, status: TicketStatus): Promise<TicketDetail> {
    return await apiPatch(`/tickets/${ticketId}/status`, { status });
  }
}
