import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class PrestataireLocalGuard extends AuthGuard('prestataire-local') {}
