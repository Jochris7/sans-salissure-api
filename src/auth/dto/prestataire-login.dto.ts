import { IsString, MinLength } from 'class-validator';

export class PrestataireLoginDto {
  @IsString()
  @MinLength(1)
  phone!: string;

  @IsString()
  @MinLength(1)
  pin!: string;
}
