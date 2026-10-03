import { IsString, MinLength } from 'class-validator';

export class CreatePrestataireDto {
  @IsString()
  @MinLength(1)
  name!: string;

  @IsString()
  @MinLength(1)
  phone!: string;
}
