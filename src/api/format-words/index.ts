import { FormatWord, FormatWordDetail } from "src/types/format-word";
import { apiGet, apiPost, apiDelete, apiPatch } from "src/utils/api-request";

export class FormatWordsApi {
  static async postFormatWord(
    request: Omit<FormatWord, "id">
  ): Promise<FormatWord["id"]> {
    return await apiPost("/format_words", request);
  }

  static async getFormatWords(request: FormData): Promise<FormatWordDetail[]> {
    const response = await apiGet("/format_words", request);
    return response;
  }

  static async putFormatWords(
    request: Partial<FormatWord & Pick<FormatWord, "id">>
  ) {
    return await apiPatch(`/format_words/${request.id}`, request);
  }

  static async deleteFormatWord(id: FormatWord["id"]) {
    return await apiDelete(`/format_words/${id}`, { id });
  }
}
