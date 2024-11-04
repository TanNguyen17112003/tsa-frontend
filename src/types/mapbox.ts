export interface AddressItem {
  name: string;
  mapbox_id: string;
  feature_type: string;
  address: string;
  full_address: string;
  place_formatted: string;
  context: any;
  language: string;
  maki?: string;
  poi_category?: any[];
  poi_category_ids?: any[];
  external_ids?: any;
  metadata?: any;
  distance?: number;
}

export interface AddressListResponse {
  suggestions: AddressItem[];
  attribution: string;
  response_id: string;
}
