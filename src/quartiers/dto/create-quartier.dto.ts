import { IsInt, IsString, Min, MinLength } from 'class-validator';

export class CreateQuartierDto {
  @IsString()
  @MinLength(1)
  label!: string;

  @IsInt()
  @Min(0)
  price!: number;
}
