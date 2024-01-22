
import { Inventory, InventoryDetail } from "src/types/inventory";
import { apiGet, apiPost, apiDelete, apiPatch } from "src/utils/api-request";

export class InventoriesApi {
  static async postInventory(request: Omit<Inventory, "id">): Promise<number> {
    return await apiPost("/inventories", request);
  }

  static async getInventories(request: FormData): Promise<InventoryDetail[]> {
    const response = await apiGet("/inventories", request);
    return response;
  }

  static async putInventories(
    request: Partial<Inventory & Pick<Inventory, "id">>
  ) {
    return await apiPatch(`/inventories/${request.id}`, request);
  }

  static async deleteInventory(id: Inventory['id']) {
    return await apiDelete(`/inventories/${id}`, { id });
  }
}
