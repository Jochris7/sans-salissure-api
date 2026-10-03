import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Quartier } from '../entities/Quartier';
import { CreateQuartierDto } from './dto/create-quartier.dto';
import { UpdateQuartierDto } from './dto/update-quartier.dto';
import { runOrConflict } from '../common/db-errors';

@Injectable()
export class QuartiersService {
  constructor(
    @InjectRepository(Quartier) private readonly repo: Repository<Quartier>,
  ) {}

  findAll(): Promise<Quartier[]> {
    return this.repo.find({ order: { label: 'ASC' } });
  }

  async create(dto: CreateQuartierDto): Promise<Quartier> {
    const id = `${dto.label.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
    const quartier = this.repo.create({
      id,
      label: dto.label,
      price: dto.price,
    });
    return this.repo.save(quartier);
  }

  async update(id: string, dto: UpdateQuartierDto): Promise<Quartier> {
    await this.repo.update({ id }, dto);
    return this.repo.findOneByOrFail({ id });
  }

  async remove(id: string): Promise<void> {
    await runOrConflict(
      () => this.repo.delete({ id }),
      'Impossible de supprimer ce quartier : des commandes ou abonnements y font référence.',
    );
  }
}
