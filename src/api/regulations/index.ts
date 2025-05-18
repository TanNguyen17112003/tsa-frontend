import { apiDelete, apiGet, apiPatch, apiPost, apiPut, getFormData } from 'src/utils/api-request';
import { DormitoryRegulation } from 'src/types/regulation';

export interface RegulationBanThresholdRequest {
  banThreshold: number;
}

interface RegulationTimeSlotRequest {
  id?: string;
  startTime: string;
  endTime: string;
}

export class RegulationsApi {
  static async getRegulations(): Promise<DormitoryRegulation[]> {
    return await apiGet('/regulation/all');
  }

  static async getRegulationByDormitory(dormitoryName: string): Promise<DormitoryRegulation> {
    return await apiGet(`/regulation?dormitory=${dormitoryName}`);
  }

  static async updateRegulationBanThreshold(
    dormitoryId: string,
    request: RegulationBanThresholdRequest
  ) {
    return await apiPatch(`/regulation/${dormitoryId}/ban-threshold`, request);
  }

  static async createRegulationTimeSlot(dormitoryId: string, request: RegulationTimeSlotRequest) {
    return await apiPost(`/regulation/${dormitoryId}/delivery-slots`, request);
  }

  static async updateRegulationTimeSlot(dormitoryId: string, request: RegulationTimeSlotRequest) {
    return await apiPatch(`/regulation/${dormitoryId}/delivery-slots`, request);
  }

  static async deleteRegulationTimeSlot(dormitoryId: string, timeSlotId: string) {
    return await apiDelete(`/regulation/${dormitoryId}/delivery-slots/`, { id: timeSlotId });
  }
}
