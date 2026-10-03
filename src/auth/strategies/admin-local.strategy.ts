import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { AdminUser } from '../../entities/AdminUser';
import type { AdminSessionPayload } from '../types';

@Injectable()
export class AdminLocalStrategy extends PassportStrategy(
  Strategy,
  'admin-local',
) {
  constructor(
    @InjectRepository(AdminUser)
    private readonly adminRepo: Repository<AdminUser>,
  ) {
    super({ usernameField: 'email', passwordField: 'password' });
  }

  async validate(
    email: string,
    password: string,
  ): Promise<AdminSessionPayload> {
    if (!email || !password)
      throw new UnauthorizedException('Identifiants incorrects');

    const admin = await this.adminRepo.findOne({
      where: { email: email.trim().toLowerCase() },
    });
    if (!admin) throw new UnauthorizedException('Identifiants incorrects');

    const valid = await bcrypt.compare(password, admin.passwordHash);
    if (!valid) throw new UnauthorizedException('Identifiants incorrects');

    return { role: 'admin', adminId: admin.id, email: admin.email };
  }
}
