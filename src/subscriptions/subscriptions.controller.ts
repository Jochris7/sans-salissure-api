import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AdminJwtGuard } from '../auth/guards/admin-jwt.guard';
import { SubscriptionsService } from './subscriptions.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';

@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptions: SubscriptionsService) {}

  @UseGuards(AdminJwtGuard)
  @Get()
  findAll() {
    return this.subscriptions.findAll();
  }

  // Pas d'authentification : c'est le client qui souscrit depuis /abonnement.
  @Post()
  create(@Body() dto: CreateSubscriptionDto) {
    return this.subscriptions.create(dto);
  }

  @UseGuards(AdminJwtGuard)
  @Patch(':id')
  toggle(@Param('id') id: string) {
    return this.subscriptions.toggle(id);
  }
}
