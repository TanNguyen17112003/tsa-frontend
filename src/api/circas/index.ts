
import { Circa, CircaDetail } from "src/types/circas";
import { apiGet, apiPost, apiDelete, apiPatch } from "src/utils/api-request";

export class CircasApi {
  static async postCirca(request: Omit<Circa, "id">): Promise<Circa["id"]> {
    return await apiPost("/circas", request);
  }

  static async getCircas(request: FormData): Promise<CircaDetail[]> {
    const response = await apiGet("/circas", request);
    return response;
  }

  static async putCircas(request: Partial<Circa & Pick<Circa, "id">>) {
    return await apiPatch(`/circas/${request.id}`, request);
  }

  static async deleteCirca(id: Circa["id"]) {
    return await apiDelete(`/circas/${id}`, { id });
  }
}

