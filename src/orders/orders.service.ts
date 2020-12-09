import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Orders } from '../models/Order.schema';
import { Model } from 'mongoose';
import ResponseMsgs from 'src/utils/ResponseMsgs';
const stripe = require('stripe')('sk_test_l1bAw4ZYCu9o5ZGChKYaQBaQ00h9cVfYqj');
const uuid = require('uuid');

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel('Orders') private readonly ordersModel: Model<Orders>,
  ) {}

  async addNewOrder(order) {
    // console.log(order);
    try {
      let newOrder = this.ordersModel(order);
      await newOrder.save();
      // console.log(newOrder);
      return { msg: ResponseMsgs.Created };
    } catch (error) {
      console.log(error);
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          msg: ResponseMsgs.failed,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async addToStripe(token, amount) {
    try {
      const customer = await stripe.customers.create({
        email: token.email,
        source: token.id,
      });

      const idempotencyKey = Math.floor(100000 + Math.random() * 900000);
      const charge = await stripe.charges.create(
        {
          amount,
          currency: 'usd',
          customer: customer.id,
          receipt_email: token.email,
          description: `Online Purchase from Saro Classic`,
          shipping: {
            name: token.card.name,
            address: {
              line1: token.card.address_line1,
              city: token.card.address_city,
              country: 'Pakistan',
              postal_code: token.card.address_zip,
            },
          },
        },
        {
          idempotencyKey,
        },
      );
      // console.log(charge);
      return { msg: 'Stripe Payment Done !' };
    } catch (error) {
      console.error('Error:', error);
      throw new BadRequestException(error);
    }
  }
}
