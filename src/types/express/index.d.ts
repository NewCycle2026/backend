// src/types/express/index.d.ts
import { JwtPayload } from '@/modules/admin-auth/types/jwt-payload';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
      headers: {
        authorization?: string;
        [key: string]: any;
      };
    }
  }
}