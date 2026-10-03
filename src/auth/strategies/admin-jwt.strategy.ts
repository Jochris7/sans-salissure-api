import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import type { Request } from 'express';
import { ADMIN_COOKIE, type AdminSessionPayload } from '../types';

@Injectable()
export class AdminJwtStrategy extends PassportStrategy(Strategy, 'jwt-admin') {
  constructor(config: ConfigService) {
    super({
      // Lit le JWT depuis le cookie httpOnly plutôt que l'en-tête Authorization
      // (nécessite cookie-parser, activé dans main.ts). req.cookies est typé
      // `any` par @types/cookie-parser lui-même (pas un souci de ce fichier) —
      // le cast explicite ci-dessous borne cette imprécision à un seul endroit.
      jwtFromRequest: (req: Request): string | null =>
        (req?.cookies?.[ADMIN_COOKIE] as string | undefined) ?? null,
      secretOrKey: config.getOrThrow<string>('AUTH_SECRET'),
    });
  }

  validate(payload: AdminSessionPayload): AdminSessionPayload {
    return payload;
  }
}
