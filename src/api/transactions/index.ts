import { Transaction, TransactionDetail } from "src/types/transaction";
import { apiGet, apiPost, apiDelete, apiPatch } from "src/utils/api-request";

export class TransactionsApi {
  static async postTransaction(
    request: Omit<Transaction, "id">[]
  ): Promise<Transaction[]> {
    return await apiPost("/transactions", request);
  }

  static async getTransactions(
    request: FormData
  ): Promise<TransactionDetail[]> {
    const response = await apiGet("/transactions", request);
    return response;
  }

  static async putTransactions(
    request: Partial<Transaction & Pick<Transaction, "id">>
  ) {
    return await apiPatch(`/transactions/${request.id}`, request);
  }

  static async deleteTransaction(id: Transaction["id"]) {
    return await apiDelete(`/transactions/${id}`, { id });
  }
}
