import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';
import {
  ADMIN_COOKIE,
  PRESTA_COOKIE,
  type AdminSessionPayload,
  type PrestataireSessionPayload,
  type StaffSession,
} from '../types';

// Une commande/un abonnement peut être touché par l'admin OU par le
// prestataire assigné — jamais par un tiers non authentifié. Les deux
// stratégies JWT (jwt-admin / jwt-prestataire) sont indépendantes ; Passport
// n'a pas de composition "OU" native, donc ce guard essaie l'un puis l'autre
// directement via JwtService, et attache le résultat sur `request.staff`.
@Injectable()
export class StaffGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context
      .switchToHttp()
      .getRequest<Request & { staff?: StaffSession }>();

    // req.cookies est typé `any` par @types/cookie-parser lui-même — cast
    // explicite pour borner cette imprécision à la lecture (voir aussi
    // admin-jwt.strategy.ts, qui a le même souci pour la même raison).
    const adminToken = req.cookies?.[ADMIN_COOKIE] as string | undefined;
    if (adminToken) {
      try {
        const payload =
          await this.jwt.verifyAsync<AdminSessionPayload>(adminToken);
        req.staff = { role: 'admin', session: payload };
        return true;
      } catch {
        // on retente avec le cookie prestataire ci-dessous
      }
    }

    const prestaToken = req.cookies?.[PRESTA_COOKIE] as string | undefined;
    if (prestaToken) {
      try {
        const payload =
          await this.jwt.verifyAsync<PrestataireSessionPayload>(prestaToken);
        req.staff = { role: 'prestataire', session: payload };
        return true;
      } catch {
        // tombe sur l'exception ci-dessous
      }
    }

    throw new UnauthorizedException('Non authentifié');
  }
}
