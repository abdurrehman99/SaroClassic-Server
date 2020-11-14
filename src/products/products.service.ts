import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from '../models/Product.schema';
import ResponseMsgs from '../utils/ResponseMsgs';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel('Product') private readonly productsModel: Model<Product>,
  ) {}

  /******* Get All products *******/
  async getAllProducts() {
    const products = await this.productsModel.find();
    throw new HttpException(
      {
        statusCode: HttpStatus.OK,
        products,
      },
      HttpStatus.OK,
    );
  }
}
