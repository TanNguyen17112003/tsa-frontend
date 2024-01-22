import { Machine, MachineDetail } from "src/types/machine";
import { apiGet, apiPost, apiDelete, apiPatch } from "src/utils/api-request";

export class MachinesApi {
  static async postMachine(request: Machine[]): Promise<string> {
    return await apiPost("/machines", request);
  }

  static async getMachines(request: FormData): Promise<MachineDetail[]> {
    const response = await apiGet("/machines", request);
    return response;
  }

  static async putMachines(
    request: Partial<Machine & Pick<Machine, "id">> & { new_id?: Machine["id"] }
  ) {
    return await apiPatch(`/machines/${request.id}/${request.station_id}`, {
      ...request,
      id: request.new_id || request.id,
    });
  }

  static async deleteMachine(id: string) {
    return await apiDelete(`/machines/${id}`, { id });
  }

  static async deleteMachines(request: Machine[]): Promise<void> {
    return await apiDelete("/machines", request);
  }
}
