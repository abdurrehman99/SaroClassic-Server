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
import { Admin } from '../models/Admin.schema';
import { Category } from '../models/Category.schema';
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
import ResponseMsgs from '../utils/ResponseMsgs';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel('Admin') private readonly adminModel: Model<Admin>,
    @InjectModel('Category') private readonly categoryModel: Model<Admin>,
  ) {}

  /******* Login Admin *******/
  async login(email, password) {
    let admin = await this.adminModel.findOne({ email });
    if (admin) {
      let passwordMatched = await bcrypt.compareSync(password, admin.password);
      if (passwordMatched) {
        const token = jwt.sign({ email }, 'secret', {
          expiresIn: '24h',
        });
        throw new HttpException(
          {
            statusCode: HttpStatus.OK,
            token: 'Bearer ' + token,
          },
          HttpStatus.OK,
        );
      } else throw new BadRequestException(ResponseMsgs.wrongCredentials);
    } else {
      throw new BadRequestException(ResponseMsgs.wrongCredentials);
    }
  }

  /******* Add new category *******/
  async addNewCategory(name) {
    try {
      let newCategory = this.categoryModel({
        name,
      });
      await newCategory.save();
      return { msg: ResponseMsgs.categoryCreated };
    } catch (error) {
      console.log(error);
      throw new BadRequestException(ResponseMsgs.categoryExist);
    }
  }

  /******* Rename category *******/
  async renameCategory(name, newName) {
    const category = await this.categoryModel.findOne({ name });
    if (category) {
      await this.categoryModel.findOneAndUpdate({ name }, { name: newName });
      throw new HttpException(
        {
          statusCode: HttpStatus.OK,
          msg: ResponseMsgs.categoryUpdated,
        },
        HttpStatus.OK,
      );
    } else {
      throw new BadRequestException(ResponseMsgs.categoryNotExist);
    }
  }

  /******* Delete category *******/
  async deleteCategory(name) {
    const categoryDeleted = await this.categoryModel.deleteOne({ name });
    if (categoryDeleted.deletedCount === 1) {
      throw new HttpException(
        {
          statusCode: HttpStatus.OK,
          msg: ResponseMsgs.categoryDeleted,
        },
        HttpStatus.OK,
      );
    } else {
      throw new BadRequestException();
    }
  }
}
