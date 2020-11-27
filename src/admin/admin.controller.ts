import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Delete,
  Query,
  Put,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { Product } from '../models/Product.schema';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  /** Admin Routes **/
  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    return await this.adminService.login(email, password);
  }

  @Post('changePassword')
  async changePassword(
    @Body('passwordNew') passwordNew: string,
    @Body('passwordOld') passwordOld: string,
  ) {
    return await this.adminService.changePassword(passwordOld, passwordNew);
  }

  /** Category Routes **/

  @Post('addNewCategory')
  async addNewCategory(@Body('name') name: string) {
    return await this.adminService.addNewCategory(name.toLocaleUpperCase());
  }

  @Post('renameCategory')
  async renameCategory(
    @Body('name') name: string,
    @Body('newName') newName: string,
  ) {
    return await this.adminService.renameCategory(
      name.toUpperCase(),
      newName.toUpperCase(),
    );
  }

  @Delete('deleteCategory')
  async deleteCategory(@Query('name') name: string) {
    return await this.adminService.deleteCategory(name.toUpperCase());
  }

  /** Product Routes **/

  @Post('addNewProduct')
  async addNewProduct(@Body() Body: Product) {
    return await this.adminService.addNewProduct(Body);
  }

  @Post('editProduct')
  async editProduct(
    @Body('id') id: string,
    @Body('name') name: string,
    @Body('category') category: string,
    @Body('quantity') quantity: number,
    @Body('images') images: [],
    @Body('description') description: string,
    @Body('outOfStock') outOfStock: string,
    @Body('price') price: string,
  ) {
    return await this.adminService.editProduct(
      id,
      name,
      category,
      quantity,
      images,
      description,
      outOfStock,
      price,
    );
  }

  @Delete('deleteProduct')
  async deleteProduct(@Query('id') id: string) {
    return await this.adminService.deleteProduct(id);
  }

  @Put('featureProduct')
  async featureProduct(
    @Query('id') id: string,
    @Body('featured') featured: boolean,
  ) {
    console.log(id, featured);
    return await this.adminService.featureProduct(id, featured);
  }
}
