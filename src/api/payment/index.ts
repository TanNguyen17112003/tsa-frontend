import { apiDelete, apiGet, apiPatch, apiPost, apiPut, getFormData } from 'src/utils/api-request';
import { MomoPaymentRequest, PayOSPaymentRequest } from 'src/types/payment';

export class PaymentsApi {
  static async postMomoPayment(request: MomoPaymentRequest) {
    return await apiPost('/payment/momo', request);
  }

  static async postPayOSPayment(request: PayOSPaymentRequest) {
    return await apiPost('/payment/payos', request);
  }
}
