import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    return await this.adminService.login(email, password);
  }

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
}
