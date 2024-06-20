import { Controller, Get, Query } from '@nestjs/common';
import { MapService } from './map.service';

@Controller('map')
export class MapController {
  constructor(private readonly mapService: MapService) {}

  @Get('search')
  search(@Query('q') input: string) {
    return this.mapService.search(input);
  }

  @Get('search/location')
  searchByLocation(@Query('lat') lat: string, @Query('long') long: string) {
    console.log(lat, long);
    return this.mapService.searchByLocation(lat, long);
  }
  @Get('details')
  detail(@Query('placeId') placeId: string) {
    return this.mapService.detail(placeId);
  }
}
