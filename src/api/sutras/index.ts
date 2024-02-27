import { Sutra, SutraDetail } from "src/types/sutra";
import {
  apiGet,
  apiPost,
  apiDelete,
  apiPatch,
  getFormData,
} from "src/utils/api-request";

export class SutrasApi {
  static async postSutra(request: Omit<Sutra, "id">): Promise<Sutra["id"]> {
    return await apiPost("/sutras", request);
  }

  static async getSutras(request: {}): Promise<SutraDetail[]> {
    const response = await apiGet("/sutras", getFormData(request));
    return response;
  }

  static async putSutras(request: Partial<Sutra & Pick<Sutra, "id">>) {
    return await apiPatch(`/sutras/${request.id}`, request);
  }

  static async deleteSutra(id: Sutra["id"]) {
    return await apiDelete(`/sutras/${id}`, { id });
  }
}
