export interface DormitoryRegulation {
  id: string;
  name: string;
  banThreshold: number;
  deliverySlots: {
    id: string;
    startTime: string;
    endTime: string;
  }[];
}

export interface DormitoryRegulationTimeSlotRequest {
  id?: string;
  startTime: string;
  endTime: string;
}

export interface DormitoryRegulationTimeSlot extends DormitoryRegulationTimeSlotRequest {}
