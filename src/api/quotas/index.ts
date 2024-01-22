
import { Quota, QuotaDetail } from "src/types/quota";
import { apiGet, apiPost, apiDelete, apiPatch } from "src/utils/api-request";

export class QuotasApi {
  static async postQuota(request: Omit<Quota, "id">): Promise<number> {
    return await apiPost("/quotas", request);
  }

  static async getQuotas(request: FormData): Promise<QuotaDetail[]> {
    const response = await apiGet("/quotas", request);
    return response;
  }

  static async putQuotas(
    request: Partial<Quota & Pick<Quota, "id">>
  ) {
    return await apiPatch(`/quotas/${request.id}`, request);
  }

  static async deleteQuota(id: Quota['id']) {
    return await apiDelete(`/quotas/${id}`, { id });
  }
}
