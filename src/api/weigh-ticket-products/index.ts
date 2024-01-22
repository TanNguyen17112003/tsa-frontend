import {
  WeighTicketProduct,
  WeighTicketProductDetail,
} from "src/types/weigh-ticket-product";
import {
  apiGet,
  apiPost,
  apiDelete,
  apiPatch,
  getFormData,
} from "src/utils/api-request";

export class WeighTicketProductsApi {
  static async postWeighTicketProduct(
    request: Omit<WeighTicketProduct, "id">[]
  ): Promise<WeighTicketProduct[]> {
    return await apiPost("/weigh_ticket_products", request);
  }

  static async getWeighTicketProductFilter(
    formData: FormData
  ): Promise<string[]> {
    return await apiGet(`/weigh_ticket_products/filter`, formData);
  }

  static async getWeighTicketProductsByForm(
    formData: FormData
  ): Promise<WeighTicketProductDetail[]> {
    return await apiGet(`/weigh_ticket_products`, formData);
  }

  static async getWeighTicketProducts(
    request: Partial<WeighTicketProduct>
  ): Promise<WeighTicketProductDetail[]> {
    let response: any;
    const formData = getFormData(request);
    if (request.product_id) {
      response = await apiGet(
        `/weigh_ticket_products/${request.weigh_ticket_id || "all"}/${
          request.product_id
        }`,
        formData
      );
    } else if (request.weigh_ticket_id) {
      response = await apiGet(
        `/weigh_ticket_products/${request.weigh_ticket_id}`,
        formData
      );
    } else {
      response = await apiGet(`/weigh_ticket_products`, formData);
    }
    return response;
  }

  static async putWeighTicketProducts({
    old,
    current,
  }: {
    old: WeighTicketProduct;
    current: WeighTicketProduct;
  }) {
    return await apiPatch(
      `/weigh_ticket_products/${old.weigh_ticket_id}/${old.product_id}`,
      current
    );
  }

  static async deleteWeighTicketProduct(request: WeighTicketProduct) {
    return await apiDelete(
      `/weigh_ticket_products/${request.weigh_ticket_id}/${request.product_id}`,
      {}
    );
  }
  static async deleteWeighTicketProducts(request: WeighTicketProduct[]) {
    return await apiDelete(`/weigh_ticket_products`, request);
  }
}
