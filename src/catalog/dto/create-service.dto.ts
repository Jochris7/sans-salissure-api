import { IsIn, IsOptional, IsString, MinLength } from 'class-validator';
import {
  SERVICE_ICON_NAMES,
  type ServiceIconName,
} from '../../entities/service-icons';

export class CreateServiceDto {
  @IsString()
  @MinLength(1)
  label!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsIn(SERVICE_ICON_NAMES)
  icon?: ServiceIconName;
}
