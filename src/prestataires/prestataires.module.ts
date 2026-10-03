import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Prestataire } from '../entities/Prestataire';
import { PrestatairesController } from './prestataires.controller';
import { PrestatairesService } from './prestataires.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Prestataire]), AuthModule],
  controllers: [PrestatairesController],
  providers: [PrestatairesService],
})
export class PrestatairesModule {}
