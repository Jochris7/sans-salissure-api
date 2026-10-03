import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service } from '../entities/Service';
import { ServiceVariant } from '../entities/ServiceVariant';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { CreateVariantDto } from './dto/create-variant.dto';
import { UpdateVariantDto } from './dto/update-variant.dto';
import { runOrConflict } from '../common/db-errors';
import { DEFAULT_SERVICE_ICON } from '../entities/service-icons';

@Injectable()
export class CatalogService {
  constructor(
    @InjectRepository(Service)
    private readonly serviceRepo: Repository<Service>,
    @InjectRepository(ServiceVariant)
    private readonly variantRepo: Repository<ServiceVariant>,
  ) {}

  findAll(): Promise<Service[]> {
    return this.serviceRepo.find({
      relations: { variants: true },
      order: { label: 'ASC', variants: { id: 'ASC' } },
    });
  }

  async createService(dto: CreateServiceDto): Promise<Service> {
    const id = `${dto.label.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
    const service = this.serviceRepo.create({
      id,
      label: dto.label,
      description: dto.description ?? '',
      devis: false,
      icon: dto.icon ?? DEFAULT_SERVICE_ICON,
      variants: [],
    });
    return this.serviceRepo.save(service);
  }

  async updateService(id: string, dto: UpdateServiceDto): Promise<Service> {
    await this.serviceRepo.update({ id }, dto);
    return this.serviceRepo.findOneByOrFail({ id });
  }

  async removeService(id: string): Promise<void> {
    await runOrConflict(
      () => this.serviceRepo.delete({ id }),
      'Impossible de supprimer ce service : des commandes ou abonnements y font référence.',
    );
  }

  async createVariant(
    serviceId: string,
    dto: CreateVariantDto,
  ): Promise<ServiceVariant> {
    const localId = `variant-${Date.now()}`;
    const variant = this.variantRepo.create({
      serviceId,
      id: localId,
      label: dto.label,
      price: dto.price,
    });
    return this.variantRepo.save(variant);
  }

  async updateVariant(
    serviceId: string,
    variantId: string,
    dto: UpdateVariantDto,
  ): Promise<ServiceVariant> {
    await this.variantRepo.update({ serviceId, id: variantId }, dto);
    return this.variantRepo.findOneByOrFail({ serviceId, id: variantId });
  }

  async removeVariant(serviceId: string, variantId: string): Promise<void> {
    await runOrConflict(
      () => this.variantRepo.delete({ serviceId, id: variantId }),
      'Impossible de supprimer cette option : des commandes ou abonnements y font référence.',
    );
  }
}
