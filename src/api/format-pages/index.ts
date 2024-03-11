import { FormatPage, FormatPageDetail } from "src/types/format-page";
import { apiGet, apiPost, apiDelete, apiPatch } from "src/utils/api-request";

export class FormatPagesApi {
  static async postFormatPage(
    request: Omit<FormatPage, "id">
  ): Promise<FormatPage["id"]> {
    return await apiPost("/format_pages", request);
  }

  static async getFormatPages(request: FormData): Promise<FormatPageDetail[]> {
    const response = await apiGet("/format_pages", request);
    return response;
  }

  static async putFormatPages(
    request: Partial<FormatPage & Pick<FormatPage, "id">>
  ) {
    return await apiPatch(`/format_pages/${request.id}`, request);
  }

  static async deleteFormatPage(id: FormatPage["id"][]) {
    return await apiDelete(`/format_pages/${id}`, { id });
  }
}
