import { IsInt, IsOptional, IsString, Min, MinLength } from 'class-validator';

export class UpdateVariantDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  label?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  price?: number;
}
