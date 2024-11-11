import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { AddressListResponse } from 'src/types/mapbox';

const id = uuidv4();
const BASE_URL = 'https://api.mapbox.com/search/searchbox/v1/suggest';
const MAPBOX_ACCESS_TOKEN =
  'pk.eyJ1IjoicXVhbmNhbzIzMTAiLCJhIjoiY20yNXMxZ3BlMGRpMjJ3cWR5ZTMyNjh2MCJ9.ILNCWFtulso1GeCR7OBz-w';

interface coordinate {
  latitude: number;
  longitude: number;
}

export class MapboxsApi {
  static async getAddresses(searchText: string): Promise<AddressListResponse> {
    const response = await axios.get(
      `${BASE_URL}?q=${searchText}&language=vi&limit=1&session_token=${id}&access_token=${process.env.MAPBOX_ACCESS_TOKEN}`
    );
    return response.data;
  }

  static async getDirection(start: coordinate, end: coordinate) {
    const response = await axios.get(
      `https://api.mapbox.com/directions/v5/mapbox/driving/${start.longitude},${start.latitude};${end.longitude},${end.latitude}?geometries=geojson&access_token=${MAPBOX_ACCESS_TOKEN}`
    );
    return response.data;
  }
}
