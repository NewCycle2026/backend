// src/modules/trip/trip.controller.ts
import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { TripService } from './trip.service';

@ApiTags('trip')
@Controller('trip')
export class TripController {
  constructor(private readonly tripService: TripService) {}

  @Get('user/:userId')
  @ApiOperation({ summary: '사용자의 여행 목록 조회' })
  @ApiParam({ name: 'userId', type: Number })
  getTripsByUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.tripService.findAllByUser(userId);
  }

  @Get('recruiting')
  @ApiOperation({ summary: '모집 중인 여행 목록 조회' })
  async getRecruitingTrips() {
    return this.tripService.findRecruitingTrips();
  }
}
