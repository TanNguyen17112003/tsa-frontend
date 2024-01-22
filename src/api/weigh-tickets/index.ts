import { WeighTicket, WeighTicketDetail } from "src/types/weigh-ticket";
import { apiGet, apiPost, apiDelete, apiPatch } from "src/utils/api-request";

export class WeighTicketsApi {
  static async postWeighTicket(
    request: Omit<WeighTicket, "id">
  ): Promise<number> {
    return await apiPost("/weigh_tickets", {
      ...request,
    });
  }

  static async getWeighTickets(
    request: FormData
  ): Promise<WeighTicketDetail[]> {
    const response = await apiGet("/weigh_tickets", request);
    return response;
  }

  static async putWeighTickets(
    request: Partial<WeighTicket & Pick<WeighTicket, "id">>
  ) {
    return await apiPatch(`/weigh_tickets/${request.id}`, request);
  }

  static async putWeighTicketMin(request: Partial<WeighTicket>) {
    return await apiPatch(`/weigh_tickets/min/${request.id}`, request);
  }

  static async deleteWeighTicket(id: WeighTicket["id"]) {
    return await apiDelete(`/weigh_tickets/${id}`, { id });
  }
}
