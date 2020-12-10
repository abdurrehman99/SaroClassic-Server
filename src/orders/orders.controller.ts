import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Orders } from '../models/Order.schema';

@Controller('orders')
export class OrdersController {
  constructor(private readonly orderService: OrdersService) {}

  /** Post new Order **/
  @Post('new')
  async addNewOrder(@Body('order') order: Orders) {
    return await this.orderService.addNewOrder(order);
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
