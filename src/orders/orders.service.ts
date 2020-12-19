import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Orders } from '../models/Order.schema';
import { User } from '../models/User.schema';
import { Model } from 'mongoose';
import ResponseMsgs from 'src/utils/ResponseMsgs';
const moment = require('moment');
const stripe = require('stripe')('sk_test_l1bAw4ZYCu9o5ZGChKYaQBaQ00h9cVfYqj');

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel('Orders') private readonly ordersModel: Model<Orders>,
    @InjectModel('User') private readonly userModel: Model<Orders>,
  ) {}

  async changeStatus(_id, status) {
    let order = await this.ordersModel.findOneAndUpdate({ _id }, { status });
    if (order) {
      throw new HttpException(
        {
          statusCode: HttpStatus.CREATED,
          msg: ResponseMsgs.Updated,
        },
        HttpStatus.CREATED,
      );
    } else {
      throw new BadRequestException(ResponseMsgs.NotExist);
    }
  }

  async getAllOrders(status) {
    let orders = [];
    status
      ? (orders = await this.ordersModel.find({ status }).sort('1'))
      : (orders = await this.ordersModel.find({}).sort('1'));
    if (orders) {
      throw new HttpException(
        {
          statusCode: HttpStatus.OK,
          orders,
        },
        HttpStatus.OK,
      );
    } else {
      throw new BadRequestException(ResponseMsgs.NotExist);
    }
  }

  async addNewOrder(order, user) {
    // console.log(order);
    let orderDate = moment().format('LL');
    let orderNo =
      'SR' + Math.floor(100 + Math.random() * 900) + order.cart.length;
    console.log(orderDate);
    console.log(orderNo);

    try {
      let newOrder = this.ordersModel({ ...order, orderDate, orderNo });
      await newOrder.save();
      if (user) {
        await this.userModel.findOneAndUpdate(
          { _id: user._id },
          {
            shippingAddress: order.shippingAddress,
            $push: { orders: orderNo },
          },
        );
      }
      // console.log(newOrder);
      return { msg: ResponseMsgs.Created, orderNo };
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

  async singleUserOrders(UserId) {
    let orders = await this.ordersModel.find({ UserId });
    if (orders !== null) {
      throw new HttpException(
        {
          statusCode: HttpStatus.OK,
          orders,
        },
        HttpStatus.OK,
      );
    } else {
      throw new BadRequestException(ResponseMsgs.NotExist);
    }
  }
}
