import { Product, ProductDetail } from "src/types/product";
import { apiGet, apiPost, apiDelete, apiPatch } from "src/utils/api-request";

export class ProductsApi {
  static async postProduct(request: Product[]): Promise<Product[]> {
    return await apiPost("/products", request);
  }

  static async getProducts(request: FormData): Promise<ProductDetail[]> {
    const response = await apiGet("/products", request);
    return response;
  }

  static async putProducts(
    request: Partial<Product & Pick<Product, "id">> & { new_id?: Product["id"] }
  ) {
    return await apiPatch(`/products/${request.id}/${request.station_id}`, {
      ...request,
      id: request.new_id || request.id,
    });
  }

  static async deleteProduct(request: Product) {
    return await apiDelete(
      `/products/${request.id}/${request.station_id}`,
      request
    );
  }

  static async deleteProducts(request: Product[]): Promise<void> {
    return await apiDelete("/products", request);
  }
}
