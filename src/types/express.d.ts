// src/types/express.d.ts
import { JwtPayload } from '@/modules/admin-auth/types/jwt-payload';

declare namespace Express {
  export interface Request {
    user?: JwtPayload;
    ip?: string;
    headers: {
      authorization?: string;
      'user-agent'?: string;
      [key: string]: any; // 이거 없으면 user-agent 안 잡힘
    };
  }
}

export { };
