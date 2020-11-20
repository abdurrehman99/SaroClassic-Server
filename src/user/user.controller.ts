import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    return await this.userService.login(email, password);
  }

  @Post('signup')
  async signup(
    @Body('email') email: string,
    @Body('password') password: string,
    @Body('name') name: string,
    @Body('contact') contact: string,
  ) {
    return await this.userService.signup(email, password, name, contact);
  }

  @Post('decodeUser')
  async decodeUserData(@Body('token') token: string) {
    return await this.userService.decodeUserData(token);
  }
}
