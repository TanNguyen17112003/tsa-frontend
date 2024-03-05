import { FileData } from "src/types/file-data";
import { apiGet, apiPost, apiDelete, getFormData } from "src/utils/api-request";

export class FileDatasApi {
  static async uploadFileData(request: { file: File }): Promise<FileData> {
    return await apiPost("/files/upload", getFormData(request));
  }

  static async downloadFileDatas(
    request: Partial<FileData & Pick<FileData, "id">>
  ) {
    return await apiGet(`/files/download/${request.id}`, request);
  }

  static async deleteFileData(ids: FileData["id"][]) {
    return await apiDelete(`/files`, { ids });
  }
}
