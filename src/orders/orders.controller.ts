import { Body, Controller, Get, Post, Put, Query } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Orders } from '../models/Order.schema';
import { User } from '../models/User.schema';

@Controller('orders')
export class OrdersController {
  constructor(private readonly orderService: OrdersService) {}

  /** Get All Orders **/
  @Get('all')
  async getAllOrders(@Query('q') q: string) {
    return await this.orderService.getAllOrders(q);
  }

  /** Chnage order Status **/
  @Put('changeStatus')
  async changeStatus(@Body('id') id: string, @Body('status') status: string) {
    return await this.orderService.changeStatus(id, status);
  }

  /** Post new Order **/
  @Post('new')
  async addNewOrder(@Body('order') order: Orders, @Body('user') user: User) {
    return await this.orderService.addNewOrder(order, user);
  }

  /** Post to stripe API**/
  @Post('stripe')
  async addToStripe(
    @Body('token') token: string,
    @Body('amount') amount: number,
  ) {
    return await this.orderService.addToStripe(token, amount);
  }

  /** Post to stripe API**/
  @Get('singleUserOrders')
  async singleUserOrders(@Query('id') id: string) {
    return await this.orderService.singleUserOrders(id);
  }
}
