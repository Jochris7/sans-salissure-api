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
import { QuartiersService } from './quartiers.service';
import { CreateQuartierDto } from './dto/create-quartier.dto';
import { UpdateQuartierDto } from './dto/update-quartier.dto';

@Controller('quartiers')
export class QuartiersController {
  constructor(private readonly quartiers: QuartiersService) {}

  @Get()
  findAll() {
    return this.quartiers.findAll();
  }

  @UseGuards(AdminJwtGuard)
  @Post()
  create(@Body() dto: CreateQuartierDto) {
    return this.quartiers.create(dto);
  }

  @UseGuards(AdminJwtGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateQuartierDto) {
    return this.quartiers.update(id, dto);
  }

  @UseGuards(AdminJwtGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.quartiers.remove(id);
    return { ok: true };
  }
}
