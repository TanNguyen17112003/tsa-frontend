import { GrindingRate, GrindingRateDetail } from "src/types/grinding-rate";
import { apiGet, apiPost, apiDelete, apiPatch } from "src/utils/api-request";

export class GrindingRatesApi {
  static async postGrindingRate(
    request: Omit<GrindingRate, "id">
  ): Promise<number> {
    return await apiPost("/grinding_rates", request);
  }

  static async getGrindingRates(
    request: FormData
  ): Promise<GrindingRateDetail[]> {
    const response = await apiGet("/grinding_rates", request);
    return response;
  }

  static async putGrindingRates(
    request: Partial<GrindingRate & Pick<GrindingRate, "id">>
  ) {
    return await apiPatch(`/grinding_rates/${request.id}`, request);
  }

  static async deleteGrindingRate(id: GrindingRate["id"]) {
    return await apiDelete(`/grinding_rates/${id}`, { id });
  }
}
