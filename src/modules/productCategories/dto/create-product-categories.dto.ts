import { IsString } from "class-validator";

export class CreateProductCategoriesDto {

    @IsString()
    name: string;
}