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
import { Category } from '../models/Category.schema';
import ResponseMsgs from '../utils/ResponseMsgs';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel('Product') private readonly productsModel: Model<Product>,
    @InjectModel('Category') private readonly categoriesModel: Model<Category>,
  ) {}

  /******* Get All products *******/
  async getAllProducts() {
    const products = await this.productsModel.find();
    const categories = await this.categoriesModel.find();
    throw new HttpException(
      {
        statusCode: HttpStatus.OK,
        products,
        categories,
      },
      HttpStatus.OK,
    );
  }
}
