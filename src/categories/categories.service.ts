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
import { Category } from '../models/Category.schema';
import ResponseMsgs from '../utils/ResponseMsgs';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel('Category') private readonly categoryModel: Model<Category>,
  ) {}

  /******* Get All category *******/
  async getAllCategories() {
    const categories = await this.categoryModel.find();
    throw new HttpException(
      {
        statusCode: HttpStatus.OK,
        categories,
      },
      HttpStatus.OK,
    );
  }
}
