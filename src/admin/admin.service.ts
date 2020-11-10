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
import { Product } from '../models/Product.schema';
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
import ResponseMsgs from '../utils/ResponseMsgs';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel('Admin') private readonly adminModel: Model<Admin>,
    @InjectModel('Category') private readonly categoryModel: Model<Category>,
    @InjectModel('Category') private readonly productModel: Model<Product>,
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
      return { msg: ResponseMsgs.Created };
    } catch (error) {
      console.log(error);
      throw new BadRequestException(ResponseMsgs.Exist);
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
          msg: ResponseMsgs.Deleted,
        },
        HttpStatus.OK,
      );
    } else {
      throw new BadRequestException();
    }
  }

  /******* Add new Product  *******/
  async addNewProduct(product) {
    const newProduct = this.productModel(product);
    await newProduct.save();
    if (newProduct) return { msg: ResponseMsgs.Created };
    else throw new BadRequestException();
  }

  /******* Edit Product  *******/
  async editProduct(
    _id,
    name,
    category,
    quantity,
    images,
    description,
    outOfStock,
    price,
  ) {
    let product: any = {};
    name ? (product.name = name) : null;
    category ? (product.category = category) : null;
    quantity ? (product.quantity = quantity) : null;
    images ? (product.images = images) : null;
    description ? (product.description = description) : null;
    outOfStock ? (product.outOfStock = outOfStock) : null;
    price ? (product.price = price) : null;

    let editProduct = await this.productModel.findOneAndUpdate(
      { _id },
      product,
    );
    if (editProduct) {
      throw new HttpException(
        {
          statusCode: HttpStatus.OK,
          msg: ResponseMsgs.Updated,
        },
        HttpStatus.OK,
      );
    } else {
      throw new BadRequestException(ResponseMsgs.NotExist);
    }
  }

  /******* Delete Product  *******/
  async deleteProduct(_id) {
    let deletedProduct = await this.productModel.deleteOne(_id);
    if (deletedProduct.deletedCount === 1) {
      throw new HttpException(
        {
          statusCode: HttpStatus.OK,
          msg: ResponseMsgs.Deleted,
        },
        HttpStatus.OK,
      );
    } else {
      throw new BadRequestException(ResponseMsgs.NotExist);
    }
  }
}
