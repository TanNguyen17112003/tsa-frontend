import { StatsByCustomer, StatsByDate, StatsByStation } from "src/types/stat";
import {
  StatByCustomerForStation,
  StatByCustomerForStationDetail,
} from "src/types/stat/stat-by-customer-for-station";
import { StatByMachineForStation } from "src/types/stat/stat-by-machine-for-station";
import { StatByProductForStationDetail } from "src/types/stat/stat-by-product-for-station";
import { StatByProductTypeForStation } from "src/types/stat/stat-by-product-type-for-station";
import { apiGet, getFormData } from "src/utils/api-request";

export class StatsApi {
  static async getStatsByCustomer(request: {
    customer_id?: string[];
    station_id?: number[];
    from?: Date | number | string;
    to?: Date | number | string;
  }): Promise<StatsByCustomer[]> {
    const response = await apiGet("/stats/customers", getFormData(request));
    return response;
  }
  static async getStatsByDate(request: {
    station_id?: number[];
    from?: Date | number | string;
    to?: Date | number | string;
  }): Promise<StatsByDate[]> {
    const response = await apiGet("/stats/date", getFormData(request));
    return response;
  }

  static async getStatsByStation(request: {
    station_id?: number[];
    from?: Date | number | string;
    to?: Date | number | string;
  }): Promise<StatsByStation[]> {
    const response = await apiGet("/stats/station", getFormData(request));
    return response;
  }

  static async getStatsByCustomersForStation(request: {
    station_id: number;
    from: Date | number | string;
    to: Date | number | string;
  }): Promise<StatByCustomerForStation[]> {
    const response = await apiGet(
      "/stats/stations/by-customers",
      getFormData(request)
    );
    return response;
  }

  static async getStatsByProductsForStation(request: {
    station_id: number;
    from: Date | number | string;
    to: Date | number | string;
    customer_id?: string;
  }): Promise<StatByProductForStationDetail[]> {
    const response = await apiGet(
      "/stats/stations/by-products",
      getFormData(request)
    );
    return response;
  }

  static async getStatsByProductTypesForStation(request: {
    station_id: number;
    from: Date | number | string;
    to: Date | number | string;
  }): Promise<StatByProductTypeForStation[]> {
    const response = await apiGet(
      "/stats/stations/by-product-types",
      getFormData(request)
    );
    return response;
  }

  static async getStatsByMachinesForStation(request: {
    station_id: number;
    from: Date | number | string;
    to: Date | number | string;
    machine_type: "excavator" | "grinder";
  }): Promise<StatByMachineForStation[]> {
    const response = await apiGet(
      "/stats/stations/by-machine",
      getFormData({
        ...request,
      })
    );
    return response;
  }

  static async getStatsByProductDateForStation(request: {
    station_id: number;
    view_mode: string;
    query_time: Date | number | string;
  }): Promise<StatByProductForStationDetail[]> {
    const response = await apiGet(
      "/stats/stations/by-product-name",
      getFormData(request)
    );
    return response;
  }
}
