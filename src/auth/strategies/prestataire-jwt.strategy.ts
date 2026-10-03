import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import type { Request } from 'express';
import { PRESTA_COOKIE, type PrestataireSessionPayload } from '../types';

@Injectable()
export class PrestataireJwtStrategy extends PassportStrategy(
  Strategy,
  'jwt-prestataire',
) {
  constructor(config: ConfigService) {
    super({
      // Voir admin-jwt.strategy.ts pour le pourquoi du cast (req.cookies est
      // typé `any` par @types/cookie-parser).
      jwtFromRequest: (req: Request): string | null =>
        (req?.cookies?.[PRESTA_COOKIE] as string | undefined) ?? null,
      secretOrKey: config.getOrThrow<string>('AUTH_SECRET'),
    });
  }

  validate(payload: PrestataireSessionPayload): PrestataireSessionPayload {
    return payload;
  }
}
