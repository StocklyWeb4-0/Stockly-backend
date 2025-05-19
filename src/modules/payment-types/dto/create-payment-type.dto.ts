import { IsString, MinLength } from "class-validator";

export class CreatePaymentTypeDto {
    @IsString()
    @MinLength(3)
    name: string;
}
