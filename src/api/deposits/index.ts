
import { Deposit, DepositDetail } from "src/types/deposit";
import { apiGet, apiPost, apiDelete, apiPatch } from "src/utils/api-request";

export class DepositsApi {
  static async postDeposit(request: Omit<Deposit, "id">): Promise<number> {
    return await apiPost("/deposits", request);
  }

  static async getDeposits(request: FormData): Promise<DepositDetail[]> {
    const response = await apiGet("/deposits", request);
    return response;
  }

  static async putDeposits(
    request: Partial<Deposit & Pick<Deposit, "id">>
  ) {
    return await apiPatch(`/deposits/${request.id}`, request);
  }

  static async deleteDeposit(id: Deposit['id']) {
    return await apiDelete(`/deposits/${id}`, { id });
  }
}
