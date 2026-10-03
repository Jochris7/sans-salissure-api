import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AdminJwtGuard } from '../auth/guards/admin-jwt.guard';
import { CatalogService } from './catalog.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { CreateVariantDto } from './dto/create-variant.dto';
import { UpdateVariantDto } from './dto/update-variant.dto';

@Controller('services')
export class CatalogController {
  constructor(private readonly catalog: CatalogService) {}

  @Get()
  findAll() {
    return this.catalog.findAll();
  }

  @UseGuards(AdminJwtGuard)
  @Post()
  createService(@Body() dto: CreateServiceDto) {
    return this.catalog.createService(dto);
  }

  @UseGuards(AdminJwtGuard)
  @Patch(':id')
  updateService(@Param('id') id: string, @Body() dto: UpdateServiceDto) {
    return this.catalog.updateService(id, dto);
  }

  @UseGuards(AdminJwtGuard)
  @Delete(':id')
  async removeService(@Param('id') id: string) {
    await this.catalog.removeService(id);
    return { ok: true };
  }

  @UseGuards(AdminJwtGuard)
  @Post(':id/variants')
  createVariant(@Param('id') serviceId: string, @Body() dto: CreateVariantDto) {
    return this.catalog.createVariant(serviceId, dto);
  }

  @UseGuards(AdminJwtGuard)
  @Patch(':id/variants/:variantId')
  updateVariant(
    @Param('id') serviceId: string,
    @Param('variantId') variantId: string,
    @Body() dto: UpdateVariantDto,
  ) {
    return this.catalog.updateVariant(serviceId, variantId, dto);
  }

  @UseGuards(AdminJwtGuard)
  @Delete(':id/variants/:variantId')
  async removeVariant(
    @Param('id') serviceId: string,
    @Param('variantId') variantId: string,
  ) {
    await this.catalog.removeVariant(serviceId, variantId);
    return { ok: true };
  }
}
