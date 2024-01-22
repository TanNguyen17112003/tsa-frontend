import {
  CustomerUpdateLog,
  CustomerUpdateLogDetail,
} from "src/types/customer-update-log";
import { Station } from "src/types/station";
import { apiGet, apiPost, apiDelete, apiPatch } from "src/utils/api-request";

export class CustomerUpdateLogsApi {
  static async postCustomerUpdateLog(
    request: Omit<CustomerUpdateLog, "id">
  ): Promise<number> {
    return await apiPost("/", request);
  }

  static async getCustomerUpdateLogs(
    request: FormData
  ): Promise<CustomerUpdateLogDetail[]> {
    const response = await apiGet("/customer_update_logs", request);
    return response;
  }

  static async getCustomerUpdateLogsByStation(request: {
    station_id: Station["id"];
  }): Promise<CustomerUpdateLogDetail[]> {
    const response = await apiGet(
      "/customer_update_logs/all/" + request.station_id,
      request
    );
    return response;
  }

  static async putCustomerUpdateLogs(
    request: Partial<CustomerUpdateLog & Pick<CustomerUpdateLog, "id">>
  ) {
    return await apiPatch(`/customer_update_logs/${request.id}`, request);
  }

  static async deleteCustomerUpdateLog(id: CustomerUpdateLog["id"]) {
    return await apiDelete(`/customer_update_logs/${id}`, { id });
  }
}
