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
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
import ResponseMsgs from '../utils/ResponseMsgs';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel('Admin') private readonly adminModel: Model<Admin>,
  ) {}

  /******* Create Admin *******/
  async create(email, password) {
    let adminFound = await this.adminModel.find({});
    if (adminFound.length > 0) {
      throw new BadRequestException('Admin Already Exist !');
    } else {
      let hashedPassword = bcrypt.hashSync(password, 8);
      const admin = new this.adminModel({
        email,
        password: hashedPassword,
      });
      await admin.save();
      throw new HttpException(
        {
          statusCode: HttpStatus.CREATED,
        },
        HttpStatus.CREATED,
      );
    }
  }

  /******* Login Admin *******/
  async login(email, password) {
    let admin = await this.adminModel.findOne({ email });
    if (admin) {
      let passwordMatched = await bcrypt.compareSync(password, admin.password);
      if (passwordMatched) {
        const token = jwt.sign({ email }, 'secret', {
          expiresIn: '1h',
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
}
