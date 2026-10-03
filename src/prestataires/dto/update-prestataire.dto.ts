import { IsBoolean, IsOptional } from 'class-validator';

export class UpdatePrestataireDto {
  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @IsOptional()
  @IsBoolean()
  resetPin?: boolean;
}
