import { IsString } from "class-validator";

export class CreateStatusCreditDto {

    @IsString()
  name: string;
}
