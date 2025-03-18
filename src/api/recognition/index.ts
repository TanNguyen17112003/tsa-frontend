import { apiGet, apiPost, apiPatch, getFormData } from 'src/utils/api-request';
import { RecognitionDetail, Recognition } from 'src/types/recognition';

export interface RecognitionsFormProps {
  image: File;
}

export interface RecognitionResponse {
  orderId: string;
  brand: string;
}

export class RecognitionssApi {
  static async postRecognition(request: RecognitionsFormProps): Promise<RecognitionResponse> {
    const formData = getFormData(request);
    return await apiPost('/recognition', formData);
  }

  static async getRecognitions(): Promise<Recognition[]> {
    return await apiGet('/recognition');
  }

  static async getDetailRecognition(id: string): Promise<RecognitionDetail> {
    return await apiGet(`/recognition/${id}`);
  }
}
