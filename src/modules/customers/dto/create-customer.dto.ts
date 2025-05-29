import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateCustomerDto {
    
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    identification: string;

    @IsNotEmpty()
    phone: string;

    @IsOptional()
    @IsString()
    email: string;

    @IsNotEmpty()
    @IsString()
    address: string;
}
