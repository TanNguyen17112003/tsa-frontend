import {
  PrintedTicketInfo,
  PrintedTicketInfoDetail,
} from "src/types/printed-ticket-info";
import { apiGet, apiPost, apiDelete, apiPatch } from "src/utils/api-request";

export class PrintedTicketInfosApi {
  static async postPrintedTicketInfo(
    request: PrintedTicketInfo
  ): Promise<number> {
    return await apiPost("/printed_tickets", request);
  }

  static async getPrintedTicketInfos(
    request: FormData
  ): Promise<PrintedTicketInfoDetail[]> {
    const response = await apiGet("/printed_tickets", request);
    return response;
  }

  static async putPrintedTicketInfos(request: Partial<PrintedTicketInfo>) {
    return await apiPatch(`/printed_tickets/${request.station_id}`, request);
  }

  static async deletePrintedTicketInfo(id: number) {
    return await apiDelete(`/printed_tickets/${id}`, { id });
  }
}
