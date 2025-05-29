// src/modules/admin-auth/types/jwt-payload.ts
export type JwtPayload = {
  sub: number;
  email: string;
  role: string;
};