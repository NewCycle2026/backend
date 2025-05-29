// src/common/utils/extract-user-id.util.ts
import { JwtPayload } from '@/modules/admin-auth/types/jwt-payload';
import { UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';

/**
 * ✅ 관리자 ID만 추출 (주로 DB 비교용)
 */
export const extractUserId = (req: Request): number => {
  const userId = (req as any).user?.userId ?? (req as any).user?.sub; // 유연하게 대응
  if (!userId) throw new UnauthorizedException('유효하지 않은 사용자입니다.');
  return userId;
};


/**
 * ✅ 관리자 전체 정보(Payload) 추출
 */
export const extractUser = (req: Request): JwtPayload => {
  //const user = req.user;
  const user = (req as any).user;
  if (!user) throw new UnauthorizedException('인증된 사용자가 아닙니다.');
  return user as JwtPayload;
};


