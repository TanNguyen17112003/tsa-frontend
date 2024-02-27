import { CollectionTreeResponse } from "src/modules/Collection/components/CollectionTree/data";
import { Collection, CollectionDetail } from "src/types/collection";
import {
  apiGet,
  apiPost,
  apiDelete,
  apiPatch,
  getFormData,
} from "src/utils/api-request";

export class CollectionsApi {
  static async postCollection(
    request: Omit<Collection, "id">
  ): Promise<Collection["id"]> {
    return await apiPost("/collections", request);
  }

  static async getCollections(request: {}): Promise<CollectionDetail[]> {
    const response = await apiGet("/collections", getFormData(request));
    return response;
  }

  static async getCollectionTree(request: {}): Promise<CollectionTreeResponse> {
    const response = await apiGet("/collections", getFormData(request));
    return response;
  }

  static async putCollections(
    request: Partial<Collection & Pick<Collection, "id">>
  ) {
    return await apiPatch(`/collections/${request.id}`, request);
  }

  static async deleteCollection(ids: Collection["id"][]) {
    return await apiDelete(`/collections`, { ids });
  }
}
