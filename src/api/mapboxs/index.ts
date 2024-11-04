import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { AddressListResponse } from 'src/types/mapbox';

const id = uuidv4();
const BASE_URL = 'https://api.mapbox.com/search/searchbox/v1/suggest';

export class MapboxsApi {
  static async getAddresses(searchText: string): Promise<AddressListResponse> {
    const response = await axios.get(
      `${BASE_URL}?q=${searchText}&language=vi&limit=1&session_token=${id}&access_token=${process.env.MAPBOX_ACCESS_TOKEN}`
    );
    return response.data;
  }
}
