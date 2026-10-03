import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription } from '../entities/Subscription';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectRepository(Subscription)
    private readonly repo: Repository<Subscription>,
  ) {}

  findAll(): Promise<Subscription[]> {
    return this.repo.find({ order: { clientName: 'ASC' } });
  }

  create(dto: CreateSubscriptionDto): Promise<Subscription> {
    const subscription = this.repo.create({ ...dto, active: true });
    return this.repo.save(subscription);
  }

  async toggle(id: string): Promise<Subscription> {
    const current = await this.repo.findOneBy({ id });
    if (!current) throw new NotFoundException('Introuvable');

    await this.repo.update({ id }, { active: !current.active });
    return this.repo.findOneByOrFail({ id });
  }
}
