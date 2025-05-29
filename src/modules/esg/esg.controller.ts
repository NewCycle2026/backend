// src/modules/esg/esg.controller.ts
import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { EsgService } from './esg.service';

@ApiTags('ESG')
@Controller('ESG')
export class EsgController {
  constructor(private readonly esgService: EsgService) {}

  @Get(':userId')
  @ApiOperation({ summary: '사용자의 ESG 점수 목록 조회' })
  @ApiParam({ name: 'userId', type: Number, description: '사용자 ID' })
  @ApiResponse({ status: 200, description: 'ESG 리포트 조회 성공' })
  getUserEsgReports(@Param('userId', ParseIntPipe) userId: number) {
    return this.esgService.getUserReports(userId);
  }
}
