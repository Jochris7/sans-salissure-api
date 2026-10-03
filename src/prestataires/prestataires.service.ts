import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Prestataire } from '../entities/Prestataire';
import { CreatePrestataireDto } from './dto/create-prestataire.dto';
import { UpdatePrestataireDto } from './dto/update-prestataire.dto';
import { runOrConflict } from '../common/db-errors';

function randomPin(): string {
  return String(Math.floor(1000 + Math.random() * 9000));
}

// L'admin doit pouvoir communiquer le PIN au prestataire juste après
// création — comme il n'est pas stocké en clair, on le renvoie une seule
// fois dans la réponse de création (ou de réinitialisation), jamais relu ensuite.
@Injectable()
export class PrestatairesService {
  constructor(
    @InjectRepository(Prestataire)
    private readonly repo: Repository<Prestataire>,
  ) {}

  findAll() {
    return this.repo.find({
      select: { id: true, name: true, phone: true, active: true },
      order: { name: 'ASC' },
    });
  }

  async create(dto: CreatePrestataireDto) {
    const pin = randomPin();
    const pinHash = await bcrypt.hash(pin, 10);

    const prestataire = this.repo.create({
      name: dto.name,
      phone: dto.phone,
      pinHash,
      active: true,
    });
    await runOrConflict(
      () => this.repo.save(prestataire),
      'Ce numéro de téléphone est déjà utilisé par un autre prestataire.',
    );

    return {
      id: prestataire.id,
      name: prestataire.name,
      phone: prestataire.phone,
      active: prestataire.active,
      pin,
    };
  }

  async update(id: string, dto: UpdatePrestataireDto) {
    const current = await this.repo.findOneBy({ id });
    if (!current) throw new NotFoundException('Introuvable');

    const active = dto.active ?? !current.active;
    let pin: string | undefined;
    let pinHash = current.pinHash;
    if (dto.resetPin) {
      pin = randomPin();
      pinHash = await bcrypt.hash(pin, 10);
    }

    await this.repo.update({ id }, { active, pinHash });
    const updated = await this.repo.findOne({
      where: { id },
      select: { id: true, name: true, phone: true, active: true },
    });
    return pin ? { ...updated, pin } : updated;
  }

  async remove(id: string): Promise<void> {
    await this.repo.delete({ id });
  }
}
