import { createParamDecorator, type ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';
import type {
  AdminSessionPayload,
  PrestataireSessionPayload,
  StaffSession,
} from './types';

// req.user est rempli par Passport (AuthGuard) après une stratégie JWT réussie.
export const CurrentAdmin = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): AdminSessionPayload => {
    return ctx.switchToHttp().getRequest<Request>().user as AdminSessionPayload;
  },
);

export const CurrentPrestataire = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): PrestataireSessionPayload => {
    return ctx.switchToHttp().getRequest<Request>()
      .user as PrestataireSessionPayload;
  },
);

// req.staff est rempli par StaffGuard (admin OU prestataire).
export const CurrentStaff = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): StaffSession => {
    return ctx.switchToHttp().getRequest<Request & { staff: StaffSession }>()
      .staff;
  },
);
