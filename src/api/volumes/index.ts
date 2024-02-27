
import { Volume, VolumeDetail } from "src/types/volume";
import { apiGet, apiPost, apiDelete, apiPatch } from "src/utils/api-request";

export class VolumesApi {
  static async postVolume(request: Omit<Volume, "id">): Promise<Volume["id"]> {
    return await apiPost("/volumes", request);
  }

  static async getVolumes(request: FormData): Promise<VolumeDetail[]> {
    const response = await apiGet("/volumes", request);
    return response;
  }

  static async putVolumes(
    request: Partial<Volume & Pick<Volume, "id">>
  ) {
    return await apiPatch(`/volumes/${request.id}`, request);
  }

  static async deleteVolume(id: Volume['id']) {
    return await apiDelete(`/volumes/${id}`, { id });
  }
}
