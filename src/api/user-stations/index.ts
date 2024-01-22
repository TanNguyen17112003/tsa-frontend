import { UserStation, UserStationDetail } from "src/types/user-station";
import { apiGet, apiPost, apiDelete, apiPatch } from "src/utils/api-request";

export class UserStationsApi {
  static async postUserStation(
    request: Omit<UserStation, "id">[]
  ): Promise<number> {
    return await apiPost("/user_stations", request);
  }

  static async getUserStations(
    request: UserStation
  ): Promise<UserStationDetail[]> {
    let response: any;
    if (request.station_id) {
      response = await apiGet(
        `/user_stations/${request.user_id || "all"}/${request.station_id}`,
        request
      );
    } else if (request.user_id) {
      response = await apiGet(`/user_stations/${request.user_id}`);
    } else {
      response = await apiGet(`/user_stations`);
    }
    return response;
  }

  static async putUserStations(request: UserStation) {
    return await apiPatch(
      `/user_stations/${request.user_id}/${request.station_id}`,
      request
    );
  }

  static async deleteUserStation(request: UserStation) {
    return await apiDelete(
      `/user_stations/${request.user_id}/${request.station_id}`,
      {}
    );
  }
  static async deleteUserStations(request: UserStation[]) {
    return await apiDelete(`/user_stations`, request);
  }
}
