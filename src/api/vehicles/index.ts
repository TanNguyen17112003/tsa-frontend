import { Vehicle, VehicleDetail } from "src/types/vehicle";
import { apiGet, apiPost, apiDelete, apiPatch } from "src/utils/api-request";

export class VehiclesApi {
  static async postVehicle(request: Vehicle[]): Promise<string> {
    return await apiPost("/vehicles", request);
  }

  static async getVehicles(request: FormData): Promise<VehicleDetail[]> {
    const response = await apiGet("/vehicles", request);
    return response;
  }

  static async putVehicles(
    request: Partial<Vehicle & Pick<Vehicle, "id">> & { new_id?: Vehicle["id"] }
  ) {
    return await apiPatch(`/vehicles/${request.id}/${request.station_id}`, {
      ...request,
      id: request.new_id,
    });
  }

  static async deleteVehicle(id: string) {
    return await apiDelete(`/vehicles/${id}`, { id });
  }

  static async deleteVehicles(request: Vehicle[]): Promise<void> {
    return await apiDelete("/vehicles", request);
  }
}
