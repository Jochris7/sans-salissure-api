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
import { PrestatairesService } from './prestataires.service';
import { CreatePrestataireDto } from './dto/create-prestataire.dto';
import { UpdatePrestataireDto } from './dto/update-prestataire.dto';

@UseGuards(AdminJwtGuard)
@Controller('prestataires')
export class PrestatairesController {
  constructor(private readonly prestataires: PrestatairesService) {}

  @Get()
  findAll() {
    return this.prestataires.findAll();
  }

  @Post()
  create(@Body() dto: CreatePrestataireDto) {
    return this.prestataires.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePrestataireDto) {
    return this.prestataires.update(id, dto);
  }

  // Les commandes déjà assignées à ce prestataire restent en base, seulement
  // détachées (assignedToId -> null) grâce au ON DELETE SET NULL sur la FK.
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.prestataires.remove(id);
    return { ok: true };
  }
}
