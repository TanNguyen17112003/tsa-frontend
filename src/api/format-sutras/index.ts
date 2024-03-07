import { FormatSutra, FormatSutraDetail } from "src/types/format-sutra";
import { apiGet, apiPost, apiDelete, apiPatch } from "src/utils/api-request";

export class FormatSutrasApi {
  static async postFormatSutra(
    request: Omit<FormatSutra, "id">
  ): Promise<FormatSutra["id"]> {
    return await apiPost("/format_sutras", request);
  }

  static async getFormatSutras(
    request: FormData
  ): Promise<FormatSutraDetail[]> {
    const response = await apiGet("/format_sutras", request);
    return response;
  }

  static async putFormatSutras(
    request: Partial<FormatSutra & Pick<FormatSutra, "id">>
  ) {
    return await apiPatch(`/format_sutras/${request.id}`, request);
  }

  static async deleteFormatSutra(id: FormatSutra["id"]) {
    return await apiDelete(`/format_sutras/${id}`, { id });
  }
}
