import { PartialType } from '@nestjs/swagger';
import { CreateProductVariantsDto } from './create-product_variant.dto';

export class UpdateProductVariantsDto extends PartialType(CreateProductVariantsDto) {}
