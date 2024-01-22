
import { Debt, DebtDetail } from "src/types/debt";
import { apiGet, apiPost, apiDelete, apiPatch } from "src/utils/api-request";

export class DebtsApi {
  static async postDebt(request: Omit<Debt, "id">): Promise<number> {
    return await apiPost("/debts", request);
  }

  static async getDebts(request: FormData): Promise<DebtDetail[]> {
    const response = await apiGet("/debts", request);
    return response;
  }

  static async putDebts(
    request: Partial<Debt & Pick<Debt, "id">>
  ) {
    return await apiPatch(`/debts/${request.id}`, request);
  }

  static async deleteDebt(id: Debt['id']) {
    return await apiDelete(`/debts/${id}`, { id });
  }
}
