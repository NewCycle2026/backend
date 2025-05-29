// src/modules/matching/matching.controller.ts
import { Controller, Get, Post, Body, Param, Patch } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { MatchingService } from './matching.service';
import { CreateRequestDto } from './dto/create-request.dto';

@ApiTags('Matching')
@Controller('matching')
export class MatchingController {
  constructor(private readonly matchingService: MatchingService) {}

  @Get('candidates/:tripId')
  @ApiOperation({ summary: '추천된 동행자 후보 목록 조회' })
  @ApiResponse({ status: 200, description: '후보 목록 반환' })
  async getCandidates(@Param('tripId') tripId: number) {
    return this.matchingService.getCandidates(+tripId);
  }

  @Post('request')
  @ApiOperation({ summary: '동행 요청 보내기' })
  @ApiBody({ type: CreateRequestDto })
  @ApiResponse({ status: 201, description: '동행 요청 완료' })
  async sendRequest(@Body() dto: CreateRequestDto) {
    return this.matchingService.sendRequest(dto);
  }

  @Patch('request/:id/accept')
  @ApiOperation({ summary: '동행 요청 수락' })
  @ApiResponse({ status: 200, description: '수락 성공 및 Companion 등록' })
  async acceptRequest(@Param('id') id: number) {
    return this.matchingService.acceptRequest(+id);
  }
}
