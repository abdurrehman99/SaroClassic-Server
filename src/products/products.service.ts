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
  async getAllProducts(mainCategory, limit) {
    let products = [];
    if (mainCategory)
      products = await this.productsModel.find({ mainCategory }).limit(limit);
    else products = await this.productsModel.find().limit(limit);

    const categories = await this.categoriesModel.find({ mainCategory });

    throw new HttpException(
      {
        statusCode: HttpStatus.OK,
        products,
        categories,
      },
      HttpStatus.OK,
    );
  }

  /******** Get Featured Products ********/
  async getFeaturedProducts() {
    let products = await this.productsModel.find({ featured: true });
    throw new HttpException(
      {
        statusCode: HttpStatus.OK,
        products,
      },
      HttpStatus.OK,
    );
  }
}
