import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { AddressListResponse } from 'src/types/mapbox';

const id = uuidv4();
const BASE_URL = 'https://api.mapbox.com/search/searchbox/v1/suggest';

interface coordinate {
  latitude: number;
  longitude: number;
}

export class MapboxsApi {
  static async getAddresses(searchText: string): Promise<AddressListResponse> {
    const response = await axios.get(
      `${BASE_URL}?q=${searchText}&language=vi&limit=1&session_token=${id}&access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`
    );
    return response.data;
  }

  static async getDirection(start: coordinate, end: coordinate) {
    const response = await axios.get(
      `https://api.mapbox.com/directions/v5/mapbox/walking/${start.longitude},${start.latitude};${end.longitude},${end.latitude}?geometries=geojson&access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`
    );
    return response.data;
  }

  static async getCoordinates(address: string): Promise<coordinate> {
    const response = await axios.get(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`
    );
    const [longitude, latitude] = response.data.features[0].center;
    return { latitude, longitude };
  }
}
