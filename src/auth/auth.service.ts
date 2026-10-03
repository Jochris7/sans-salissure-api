import { ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import type { CookieOptions } from 'express';
import { AdminUser } from '../entities/AdminUser';
import type { AdminSessionPayload, PrestataireSessionPayload } from './types';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwt: JwtService,
    @InjectRepository(AdminUser)
    private readonly adminRepo: Repository<AdminUser>,
  ) {}

  async createAdmin(email: string, password: string) {
    const normalized = email.trim().toLowerCase();

    if (await this.adminRepo.exists({ where: { email: normalized } })) {
      throw new ConflictException('Un admin avec cet email existe déjà');
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const admin = await this.adminRepo.save(
      this.adminRepo.create({ email: normalized, passwordHash }),
    );
    return { id: admin.id, email: admin.email };
  }

  signSession(
    payload: AdminSessionPayload | PrestataireSessionPayload,
  ): string {
    return this.jwt.sign(payload);
  }

  get cookieOptions(): CookieOptions {
    return {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 * 1000,
    };
  }
}
