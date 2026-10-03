import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Quartier } from '../entities/Quartier';
import { QuartiersController } from './quartiers.controller';
import { QuartiersService } from './quartiers.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Quartier]), AuthModule],
  controllers: [QuartiersController],
  providers: [QuartiersService],
})
export class QuartiersModule {}
