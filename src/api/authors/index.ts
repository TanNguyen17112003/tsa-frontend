import { Author, AuthorDetail } from "src/types/author";
import {
  apiGet,
  apiPost,
  apiDelete,
  apiPatch,
  getFormData,
} from "src/utils/api-request";

export class AuthorsApi {
  static async postAuthor(request: Omit<Author, "id">): Promise<Author> {
    return await apiPost("/authors", request);
  }

  static async getAuthors(request: FormData): Promise<AuthorDetail[]> {
    const response = await apiGet("/authors", getFormData(request));
    return response;
  }

  static async putAuthors(request: Partial<Author & Pick<Author, "id">>) {
    return await apiPatch(`/authors/${request.id}`, request);
  }

  static async deleteAuthor(id: Author["id"][]) {
    return await apiDelete(`/authors/${id}`, { id });
  }
}
