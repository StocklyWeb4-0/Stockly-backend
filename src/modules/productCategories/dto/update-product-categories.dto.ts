import { PartialType } from "@nestjs/mapped-types";
import { CreateProductCategoriesDto } from "./create-product-categories.dto";

export class UpdateProductCategoriestDto extends PartialType(CreateProductCategoriesDto) {}