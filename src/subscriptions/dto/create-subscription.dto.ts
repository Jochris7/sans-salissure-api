import { IsInt, IsPositive, IsString, MinLength } from 'class-validator';

export class CreateSubscriptionDto {
  @IsString()
  @MinLength(1)
  clientName!: string;

  @IsString()
  @MinLength(1)
  phone!: string;

  @IsString()
  @MinLength(1)
  serviceId!: string;

  @IsString()
  @MinLength(1)
  variantId!: string;

  @IsString()
  @MinLength(1)
  quartierId!: string;

  @IsInt()
  @IsPositive()
  frequencyPerWeek!: number;
}
