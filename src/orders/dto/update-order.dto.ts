import { IsIn, IsOptional, IsString } from 'class-validator';
import type { OrderStatus } from '../../entities/Order';

export class UpdateOrderDto {
  @IsOptional()
  @IsIn(['nouvelle', 'en_cours', 'terminee', 'payee'])
  status?: OrderStatus;

  @IsOptional()
  @IsString()
  assignedToId?: string | null;
}
