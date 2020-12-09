import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Delete,
  Query,
  Put,
  BadRequestException,
} from '@nestjs/common';
import { UserService } from './user.service';
import * as jwt from 'jsonwebtoken';

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
    return await this.userService.signup(
      email.toLowerCase(),
      password,
      name,
      contact,
    );
  }

  @Post('decodeUser')
  async decodeUserData(@Body('token') token: string) {
    const tokenData = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(tokenData);
    if (tokenData) return await this.userService.decodeUserData(token);
    else throw new BadRequestException('Token Expired !');
  }

  @Put('updateProfile')
  async updateProfile(
    @Body('email') email: string,
    @Body('name') name: string,
    @Body('contact') contact: string,
    @Body('shippingAddress') shippingAddress: string,
  ) {
    return await this.userService.updateProfile(
      email,
      name,
      contact,
      shippingAddress,
    );
  }

  @Put('updatePassword')
  async updatePassword(
    @Body('email') email: string,
    @Body('oldPassword') oldPassword: string,
    @Body('newPassword') newPassword: string,
  ) {
    return await this.userService.updatePassword(
      email,
      oldPassword,
      newPassword,
    );
  }
}
