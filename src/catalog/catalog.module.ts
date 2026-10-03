import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service } from '../entities/Service';
import { ServiceVariant } from '../entities/ServiceVariant';
import { CatalogController } from './catalog.controller';
import { CatalogService } from './catalog.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Service, ServiceVariant]), AuthModule],
  controllers: [CatalogController],
  providers: [CatalogService],
})
export class CatalogModule {}
