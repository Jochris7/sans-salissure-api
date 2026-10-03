import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class PrestataireJwtGuard extends AuthGuard('jwt-prestataire') {}
