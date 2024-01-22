import { Trash, TrashDetail } from "src/types/trash";
import { apiGet, apiPost, apiDelete, apiPatch } from "src/utils/api-request";

export class TrashesApi {
  static async getTrashes(request: FormData): Promise<TrashDetail[]> {
    const response = await apiGet("/trashs", request);
    return response;
  }

  static async putTrashes(request: Partial<Trash & Pick<Trash, "id">>) {
    return await apiPatch(`/trashs/${request.id}`, request);
  }

  static async deleteTrash(id: Trash["id"]) {
    return await apiPost(`/trashs/restore/${id}`, { id });
  }
}
