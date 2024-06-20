import { Controller, Get, Query } from '@nestjs/common';
import { MapService } from './map.service';
import { MapLocationDto } from './dto/map.dto';

@Controller('map')
export class MapController {
  constructor(private readonly mapService: MapService) {}

  @Get('search')
  search(@Query('q') input: string) {
    return this.mapService.search(input);
  }

  @Get('search/location')
  searchByLocation(@Query() query: MapLocationDto) {
    return this.mapService.searchByLocation(query.location);
  }
  @Get('details')
  detail(@Query('placeId') placeId: string) {
    return this.mapService.detail(placeId);
  }
}
