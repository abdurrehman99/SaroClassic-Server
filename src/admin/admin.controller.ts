import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('create')
  async create(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    return await this.adminService.create(email, password);
  }

  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    return await this.adminService.login(email, password);
  }
}
