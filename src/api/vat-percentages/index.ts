import { VatPercentage, VatPercentageDetail } from "src/types/vat-percentage";
import { apiGet, apiPost, apiDelete, apiPatch } from "src/utils/api-request";

export class VatPercentagesApi {
  static async postVatPercentage(
    request: Omit<VatPercentage, "id">
  ): Promise<number> {
    return await apiPost("/vat_percentages", request);
  }

  static async getVatPercentages(
    request: FormData
  ): Promise<VatPercentageDetail[]> {
    const response = await apiGet("/vat_percentages", request);
    return response;
  }

  static async putVatPercentages(
    request: Partial<VatPercentage & Pick<VatPercentage, "id">>
  ) {
    return await apiPatch(`/vat_percentages/${request.id}`, request);
  }

  static async deleteVatPercentage(id: VatPercentage["id"]) {
    return await apiDelete(`/vat_percentages/${id}`, { id });
  }
}
