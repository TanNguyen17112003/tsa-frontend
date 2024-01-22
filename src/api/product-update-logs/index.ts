import {
  ProductUpdateLog,
  ProductUpdateLogDetail,
} from "src/types/product-update-log";
import { Station } from "src/types/station";
import { apiGet, apiPost, apiDelete, apiPatch } from "src/utils/api-request";

export class ProductUpdateLogsApi {
  static async postProductUpdateLog(
    request: Omit<ProductUpdateLog, "id">
  ): Promise<number> {
    return await apiPost("/", request);
  }

  static async getProductUpdateLogs(
    request: FormData
  ): Promise<ProductUpdateLogDetail[]> {
    const response = await apiGet("/product_update_logs", request);
    return response;
  }

  static async getProductUpdateLogsByStation(request: {
    station_id: Station["id"];
  }): Promise<ProductUpdateLogDetail[]> {
    const response = await apiGet(
      "/product_update_logs/all/" + request.station_id,
      request
    );
    return response;
  }

  static async putProductUpdateLogs(
    request: Partial<ProductUpdateLog & Pick<ProductUpdateLog, "id">>
  ) {
    return await apiPatch(`/product_update_logs/${request.id}`, request);
  }

  static async deleteProductUpdateLog(id: ProductUpdateLog["id"]) {
    return await apiDelete(`/product_update_logs/${id}`, { id });
  }
}
