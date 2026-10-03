import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Prestataire } from '../../entities/Prestataire';
import type { PrestataireSessionPayload } from '../types';

function normalizePhone(phone: string): string {
  return phone.replace(/\s+/g, '');
}

@Injectable()
export class PrestataireLocalStrategy extends PassportStrategy(
  Strategy,
  'prestataire-local',
) {
  constructor(
    @InjectRepository(Prestataire)
    private readonly prestataireRepo: Repository<Prestataire>,
  ) {
    super({ usernameField: 'phone', passwordField: 'pin' });
  }

  async validate(
    phone: string,
    pin: string,
  ): Promise<PrestataireSessionPayload> {
    if (!phone || !pin)
      throw new UnauthorizedException('Numéro ou code PIN incorrect');

    const list = await this.prestataireRepo.find({ where: { active: true } });
    const target = list.find(
      (p) => normalizePhone(p.phone) === normalizePhone(phone),
    );
    if (!target)
      throw new UnauthorizedException('Numéro ou code PIN incorrect');

    const valid = await bcrypt.compare(pin, target.pinHash);
    if (!valid) throw new UnauthorizedException('Numéro ou code PIN incorrect');

    return { role: 'prestataire', prestataireId: target.id };
  }
}
