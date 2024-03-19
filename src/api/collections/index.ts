import { Author } from "src/types/author";
import { Circa } from "src/types/circas";
import { Collection, CollectionDetail } from "src/types/collection";
import { FormatPage } from "src/types/format-page";
import { FormatSutra } from "src/types/format-sutra";
import { FormatWord } from "src/types/format-word";
import { Orison } from "src/types/orison";
import { Sutra } from "src/types/sutra";
import { Volume } from "src/types/volume";
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
  ): Promise<Collection> {
    return await apiPost("/collections", request);
  }

  static async getCollections(request: {}): Promise<CollectionDetail[]> {
    const response = await apiGet("/collections", getFormData(request));
    return response;
  }

  static async getCollectionTree(request: {}): Promise<CollectionTreeResponse> {
    const response = await apiGet("/collections/tree", getFormData(request));
    return response;
  }

  static async getCollectionCategories(request: {}): Promise<CollectionCategoriesResponse> {
    const response = await apiGet(
      "/collections/categories",
      getFormData(request)
    );
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

// export interface CollectionMin {
//   id: string;
//   name: string;
// }

// export interface SutraMin {
//   id: string;
//   name: string;
//   collection_id: string;
// }

// export interface VolumeMin {
//   id: string;
//   name: string;
//   sutras_id: string;
// }

// export interface OrisonMin {
//   id: string;
//   name: string;
//   volume_id: string;
// }

export interface UserMin {
  id: string;
  full_name: string;
}

// Define interface for the entire data structure
export interface CollectionTreeResponse {
  collections: Collection[];
  sutras: Sutra[];
  volumes: Volume[];
  orisons: Orison[];
}

export const initialCollectionTree: CollectionTreeResponse = {
  collections: [],
  sutras: [],
  volumes: [],
  orisons: [],
};

export interface CollectionCategoriesResponse {
  authors: Author[];
  format_sutras: FormatSutra[];
  format_words: FormatWord[];
  format_pages: FormatPage[];
  circas: Circa[];
  translators: UserMin[];
}

export const initialCollectionCategories: CollectionCategoriesResponse = {
  authors: [],
  format_sutras: [],
  format_words: [],
  format_pages: [],
  circas: [],
  translators: [],
};
