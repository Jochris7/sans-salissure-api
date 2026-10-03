import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminUser } from '../entities/AdminUser';
import { Prestataire } from '../entities/Prestataire';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AdminLocalStrategy } from './strategies/admin-local.strategy';
import { PrestataireLocalStrategy } from './strategies/prestataire-local.strategy';
import { AdminJwtStrategy } from './strategies/admin-jwt.strategy';
import { PrestataireJwtStrategy } from './strategies/prestataire-jwt.strategy';
import { StaffGuard } from './guards/staff.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([AdminUser, Prestataire]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow<string>('AUTH_SECRET'),
        signOptions: { expiresIn: '7d' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AdminLocalStrategy,
    PrestataireLocalStrategy,
    AdminJwtStrategy,
    PrestataireJwtStrategy,
    StaffGuard,
  ],
  exports: [StaffGuard, JwtModule],
})
export class AuthModule {}
