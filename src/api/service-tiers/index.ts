import { ServiceTier, ServiceTierDetail } from "src/types/service-tier";
import { apiGet, apiPost, apiDelete, apiPatch } from "src/utils/api-request";

export class ServiceTiersApi {
  static async postServiceTier(
    request: Omit<ServiceTier, "id">[]
  ): Promise<ServiceTier[]> {
    return await apiPost("/service_tiers", request);
  }

  static async getServiceTiers(
    request: FormData
  ): Promise<ServiceTierDetail[]> {
    const response = await apiGet("/service_tiers", request);
    return response;
  }

  static async putServiceTiers(
    request: Partial<ServiceTier & Pick<ServiceTier, "id">>
  ) {
    return await apiPatch(`/service_tiers/${request.id}`, request);
  }

  static async deleteServiceTier(id: ServiceTier["id"]) {
    return await apiDelete(`/service_tiers/${id}`, { id });
  }
}
