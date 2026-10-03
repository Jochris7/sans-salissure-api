import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { AdminLocalGuard } from './guards/admin-local.guard';
import { PrestataireLocalGuard } from './guards/prestataire-local.guard';
import { AdminJwtGuard } from './guards/admin-jwt.guard';
import { PrestataireJwtGuard } from './guards/prestataire-jwt.guard';
import { CurrentAdmin, CurrentPrestataire } from './decorators';
import {
  ADMIN_COOKIE,
  PRESTA_COOKIE,
  type AdminSessionPayload,
  type PrestataireSessionPayload,
} from './types';
import { Prestataire } from '../entities/Prestataire';
import { CreateAdminDto } from './dto/create-admin.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    @InjectRepository(Prestataire)
    private readonly prestataireRepo: Repository<Prestataire>,
  ) {}

  @UseGuards(AdminLocalGuard)
  @Post('admin/login')
  adminLogin(
    @CurrentAdmin() admin: AdminSessionPayload,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = this.auth.signSession(admin);
    res.cookie(ADMIN_COOKIE, token, this.auth.cookieOptions);
    return { email: admin.email };
  }

  @Post('admin/logout')
  adminLogout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie(ADMIN_COOKIE, { path: '/' });
    return { ok: true };
  }

  @UseGuards(AdminJwtGuard)
  @Get('admin/me')
  adminMe(@CurrentAdmin() admin: AdminSessionPayload) {
    return { authed: true, email: admin.email };
  }
  @Post('admin')
  createAdmin(@Body() dto: CreateAdminDto) {
    return this.auth.createAdmin(dto.email, dto.password);
  }

  @UseGuards(PrestataireLocalGuard)
  @Post('prestataire/login')
  async prestataireLogin(
    @CurrentPrestataire() session: PrestataireSessionPayload,
    @Res({ passthrough: true }) res: Response,
  ) {
    const prestataire = await this.prestataireRepo.findOneByOrFail({
      id: session.prestataireId,
    });
    const token = this.auth.signSession(session);
    res.cookie(PRESTA_COOKIE, token, this.auth.cookieOptions);
    return { id: prestataire.id, name: prestataire.name };
  }

  @Post('prestataire/logout')
  prestataireLogout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie(PRESTA_COOKIE, { path: '/' });
    return { ok: true };
  }

  @UseGuards(PrestataireJwtGuard)
  @Get('prestataire/me')
  async prestataireMe(
    @CurrentPrestataire() session: PrestataireSessionPayload,
  ) {
    const prestataire = await this.prestataireRepo.findOne({
      where: { id: session.prestataireId },
      select: { id: true, name: true, phone: true, active: true },
    });
    if (!prestataire || !prestataire.active) {
      return { authed: false };
    }
    return { authed: true, ...prestataire };
  }
}
