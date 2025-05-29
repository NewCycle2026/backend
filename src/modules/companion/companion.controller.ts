// src/modules/companion/companion.controller.ts
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CompanionService } from './companion.service';
import { ApplyCompanionDto } from './dto/apply-companion.dto';

@ApiTags('companion')
@Controller('companion')
export class CompanionController {
  constructor(private readonly companionService: CompanionService) {}

  @Post('apply')
  @ApiOperation({ summary: '동행 신청' })
  @ApiBody({ type: ApplyCompanionDto }) // ✅ 추가
  async applyCompanion(@Body() dto: ApplyCompanionDto) {
    return this.companionService.applyForCompanion(dto.userId, dto.tripId);
  }

  @Get(':tripId')
  @ApiOperation({ summary: '동행 신청자 목록 조회 (선택적 상태 필터링)' })
  @ApiParam({ name: 'tripId', type: Number })
  @ApiQuery({ name: 'status', required: false, enum: ['pending', 'accepted', 'rejected'] })
  async list(
    @Param('tripId', ParseIntPipe) tripId: number,
    @Query('status') status?: 'pending' | 'accepted' | 'rejected',
  ) {
    return this.companionService.listTripCompanions(tripId, status);
  }

  @Patch(':companionId/status/:status')
  @ApiOperation({ summary: '동행 상태 업데이트 (accepted / rejected)' })
  async updateStatus(
    @Param('companionId', ParseIntPipe) companionId: number,
    @Param('status') status: 'accepted' | 'rejected',
  ) {
    return this.companionService.updateStatus(companionId, status);
  }
}
