import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsIn,
  IsInt,
  IsPositive,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';

class CartLineDto {
  @IsString()
  @MinLength(1)
  serviceId!: string;

  @IsString()
  @MinLength(1)
  variantId!: string;

  @IsInt()
  @IsPositive()
  quantity!: number;
}

export class CreateOrderDto {
  @IsString()
  @MinLength(1)
  clientName!: string;

  @IsString()
  @MinLength(1)
  phone!: string;

  @IsString()
  @MinLength(1)
  quartierId!: string;

  @IsString()
  @MinLength(1)
  datetime!: string;

  @IsIn(['avant', 'apres'])
  paymentTiming!: 'avant' | 'apres';

  @IsIn(['wave', 'orange_money', 'liquide'])
  paymentMethod!: 'wave' | 'orange_money' | 'liquide';

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CartLineDto)
  cart!: CartLineDto[];
}
