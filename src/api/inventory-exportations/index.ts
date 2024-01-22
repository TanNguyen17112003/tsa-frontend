import {
  InventoryExportation,
  InventoryExportationDetail,
} from "src/types/inventory-exportation";
import { apiGet, apiPost, apiDelete, apiPatch } from "src/utils/api-request";

export class InventoryExportationsApi {
  static async postInventoryExportation(
    request: Omit<InventoryExportation, "id">
  ): Promise<number> {
    return await apiPost("/inventory_exportations", request);
  }

  static async getInventoryExportations(
    request: FormData
  ): Promise<InventoryExportationDetail[]> {
    const response = await apiGet("/inventory_exportations", request);
    return response;
  }

  static async putInventoryExportations(
    request: Partial<InventoryExportation & Pick<InventoryExportation, "id">>
  ) {
    return await apiPatch(`/inventory_exportations/${request.id}`, request);
  }

  static async deleteInventoryExportation(id: InventoryExportation["id"]) {
    return await apiDelete(`/inventory_exportations/${id}`, { id });
  }
}
