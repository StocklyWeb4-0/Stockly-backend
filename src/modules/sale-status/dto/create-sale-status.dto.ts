import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSaleStatusDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}
