export interface MomoPaymentRequest {
  orderId: string;
  amount: string;
  orderInfo: string;
  returnUrl: string;
  notifyUrl: string;
  extraData: string;
}

export interface PayOSPaymentRequest {
  orderId: string;
  amount: number;
  description: string;
  returnUrl: string;
  cancelUrl: string;
  extraData: string;
}
