import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('all')
  async getAllProducts(
    @Query('q') category: string,
    @Query('limit') l: string,
  ) {
    let limit = null;
    if (l) limit = l;
    return await this.productsService.getAllProducts(category, Number(limit));
  }

  @Get('featured')
  async getFeaturedProducts() {
    return await this.productsService.getFeaturedProducts();
  }
}
