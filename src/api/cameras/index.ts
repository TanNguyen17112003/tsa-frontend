import { Camera, CameraDetail } from "src/types/camera";
import { apiGet, apiPost, apiDelete, apiPatch } from "src/utils/api-request";

export class CamerasApi {
  static async postCamera(request: Omit<Camera, "id">): Promise<number> {
    return await apiPost("/cameras", request);
  }

  static async getCameras(request: FormData): Promise<CameraDetail[]> {
    const response = await apiGet("/cameras", request);
    return response;
  }

  static async putCameras(request: Partial<Camera & Pick<Camera, "id">>) {
    return await apiPatch(`/cameras/${request.id}`, request);
  }

  static async deleteCamera(id: number) {
    return await apiDelete(`/cameras/${id}`, { id });
  }
}
