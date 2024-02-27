
import { Collection, CollectionDetail } from "src/types/collection";
import { apiGet, apiPost, apiDelete, apiPatch } from "src/utils/api-request";

export class CollectionsApi {
  static async postCollection(request: Omit<Collection, "id">): Promise<Collection["id"]> {
    return await apiPost("/collections", request);
  }

  static async getCollections(request: FormData): Promise<CollectionDetail[]> {
    const response = await apiGet("/collections", request);
    return response;
  }

  static async putCollections(
    request: Partial<Collection & Pick<Collection, "id">>
  ) {
    return await apiPatch(`/collections/${request.id}`, request);
  }

  static async deleteCollection(id: Collection['id']) {
    return await apiDelete(`/collections/${id}`, { id });
  }
}
