import { Customer, CustomerDetail } from "src/types/customer";
import { apiGet, apiPost, apiDelete, apiPatch } from "src/utils/api-request";

export class CustomersApi {
  static async postCustomer(request: Customer[]): Promise<string> {
    return await apiPost("/customers", request);
  }

  static async getCustomers(request: FormData): Promise<CustomerDetail[]> {
    const response = await apiGet("/customers", request);
    return response;
  }

  static async putCustomers(
    request: Partial<Customer & Pick<Customer, "id">> & {
      new_id?: Customer["id"];
    }
  ) {
    return await apiPatch(`/customers/${request.id}/${request.station_id}`, {
      ...request,
      id: request.new_id || request.id,
    });
  }

  static async deleteCustomer(id: string) {
    return await apiDelete(`/customers/${id}`, { id });
  }

  static async deleteCustomers(request: Customer[]): Promise<void> {
    return await apiDelete("/customers", request);
  }
}
