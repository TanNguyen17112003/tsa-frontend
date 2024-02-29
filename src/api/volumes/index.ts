import { Volume, VolumeDetail } from "src/types/volume";
import {
  apiGet,
  apiPost,
  apiDelete,
  apiPatch,
  getFormData,
} from "src/utils/api-request";

export class VolumesApi {
  static async postVolume(request: Omit<Volume, "id">): Promise<Volume["id"]> {
    return await apiPost("/volumes", request);
  }

  static async getVolumes(request: GetVolumesPayload): Promise<VolumeDetail[]> {
    const response = await apiGet("/volumes", getFormData(request));
    return response;
  }

  static async putVolumes(request: Partial<Volume & Pick<Volume, "id">>) {
    return await apiPatch(`/volumes/${request.id}`, request);
  }

  static async deleteVolume(ids: Volume["id"][]) {
    return await apiDelete(`/volumes`, { ids });
  }
}

export interface GetVolumesPayload {
  sutra_id: string;
}
