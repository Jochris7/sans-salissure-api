import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { StaffGuard } from '../auth/guards/staff.guard';
import { CurrentStaff } from '../auth/decorators';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import type { StaffSession } from '../auth/types';

@Controller('orders')
export class OrdersController {
  constructor(private readonly orders: OrdersService) {}

  @UseGuards(StaffGuard)
  @Get()
  findAll() {
    return this.orders.findAll();
  }

  @Post()
  create(@Body() dto: CreateOrderDto) {
    return this.orders.create(dto);
  }

  @UseGuards(StaffGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateOrderDto,
    @CurrentStaff() staff: StaffSession,
  ) {
    return this.orders.update(id, dto, staff);
  }
}
