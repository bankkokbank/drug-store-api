import { Injectable, Logger } from '@nestjs/common';
import { LocationDto } from './dto/store.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Store, StoreDocument } from '../schemas/store.schema';
import { Model } from 'mongoose';
import * as moment from 'moment';

@Injectable()
export class StoreService {
  constructor(
    @InjectModel(Store.name) private readonly storeModel: Model<StoreDocument>,
  ) {}

  async getList(body: LocationDto) {
    try {
      const locationObj = JSON.parse(JSON.parse(JSON.stringify(body.location)));
      const currentDate = moment().format('YYYY-MM-DD HH:mm:ss');

      const stores = await this.storeModel.find({
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [locationObj.long, locationObj.lat],
            },
          },
        },
        'location.coordinates': { $ne: [0, 0] },
      });

      const storesWithStatus = stores.map((store) => {
        const isOpen = this.isStoreOpen(store, currentDate);
        const storeLocation: any = store?.location?.coordinates;
        return {
          ...store.toObject(),
          distance: this.calculateDistance(
            locationObj.lat,
            locationObj.long,
            storeLocation[1],
            storeLocation[0],
          ),
          isOpen,
        };
      });

      storesWithStatus.sort((a, b) => {
        if (a.isOpen && !b.isOpen) {
          return -1;
        } else if (!a.isOpen && b.isOpen) {
          return 1;
        } else {
          return a.distance - b.distance;
        }
      });

      return storesWithStatus;
    } catch (error) {
      Logger.error({ cmd: 'StoreService.getList', error: error });
      if (error.response) {
        throw new Error(error.response.message);
      }
      throw new Error(error.message);
    }
  }

  // Function to calculate distance using Haversine formula
  private calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    console.log(lat1, lon1, lat2, lon2);
    const R = 6371; // Radius of the earth in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  private isStoreOpen(store: Store, currentDate: string): boolean {
    const openTime = store.site_open_time;
    const closeTime = store.site_close_time;

    if (openTime === '00:00:00' && closeTime === '00:00:00') {
      return true;
    }

    const currentTime = moment(currentDate, 'YYYY-MM-DD HH:mm:ss');
    const open = moment(openTime, 'HH:mm:ss');
    const close = moment(closeTime, 'HH:mm:ss');

    if (
      currentTime.isBetween(open, close) ||
      currentTime.isSame(open) ||
      currentTime.isSame(close)
    ) {
      return true;
    }

    return false;
  }
}
