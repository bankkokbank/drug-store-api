import { Injectable, Logger } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { LocationDto, MapLocationDto } from './dto/map.dto';

@Injectable()
export class MapService {
  async search(input: string) {
    try {
      const instance = await this.createInstance();

      const response = await instance.get(`/place/autocomplete/json`, {
        params: {
          input: input,
          key: process.env.GOOGLE_MAPS_API_KEY,
          language: 'th',
        },
      });

      return response.data;
    } catch (error) {
      Logger.error({ cmd: 'MapService.search', error: error });
      if (error.response) {
        throw new Error(error.response.message);
      }
      throw new Error(error.message);
    }
  }

  async searchByLocation(location: LocationDto) {
    try {
      const locationObj = JSON.parse(JSON.parse(JSON.stringify(location)));

      const instance = await this.createInstance();
      const response = await instance.get(`/geocode/json`, {
        params: {
          latlng: `${locationObj.lat},${locationObj.long}`,
          key: process.env.GOOGLE_MAPS_API_KEY,
          language: 'th',
        },
      });

      return response.data;
    } catch (error) {
      Logger.error({ cmd: 'MapService.searchByLocation', error: error });
      if (error.response) {
        throw new Error(error.response.message);
      }
      throw new Error(error.message);
    }
  }

  async detail(placeId: string) {
    try {
      const instance = await this.createInstance();

      const response = await instance.get(`/place/details/json`, {
        headers: { 'Accept-Language': 'th' },
        params: {
          place_id: placeId,
          key: process.env.GOOGLE_MAPS_API_KEY,
        },
      });
      return response.data;
    } catch (error) {
      Logger.error({ cmd: 'MapService.detail', error: error });
      if (error.response) {
        throw new Error(error.response.message);
      }
      throw new Error(error.message);
    }
  }

  async createInstance(headers = {}): Promise<AxiosInstance> {
    const instance = axios.create({
      baseURL: process.env.GOOGLE_MAPS_API_URL,
      headers: headers,
    });
    return instance;
  }
}
