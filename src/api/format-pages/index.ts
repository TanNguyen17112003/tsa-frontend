
import { FormatPage, FormatPageDetail } from "src/types/format-page";
import { apiGet, apiPost, apiDelete, apiPatch } from "src/utils/api-request";

export class FormatPagesApi {
  static async postFormatPage(request: Omit<FormatPage, "id">): Promise<FormatPage["id"]> {
    return await apiPost("/format-pages", request);
  }

  static async getFormatPages(request: FormData): Promise<FormatPageDetail[]> {
    const response = await apiGet("/format-pages", request);
    return response;
  }

  static async putFormatPages(
    request: Partial<FormatPage & Pick<FormatPage, "id">>
  ) {
    return await apiPatch(`/format-pages/${request.id}`, request);
  }

  static async deleteFormatPage(id: FormatPage['id']) {
    return await apiDelete(`/format-pages/${id}`, { id });
  }
}
