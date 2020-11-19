import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '../models/User.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import ResponseMsgs from '../utils/ResponseMsgs';

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async login(email, password) {
    let user = await this.userModel.findOne({ email });
    if (user) {
      let passwordMatched = await bcrypt.compareSync(password, user.password);
      if (passwordMatched) {
        const token = jwt.sign({ email }, 'secret', {
          expiresIn: '24h',
        });
        user.password = '';
        throw new HttpException(
          {
            statusCode: HttpStatus.OK,
            token: 'Bearer ' + token,
            user,
          },
          HttpStatus.OK,
        );
      } else throw new BadRequestException(ResponseMsgs.wrongCredentials);
    } else {
      throw new BadRequestException(ResponseMsgs.wrongCredentials);
    }
  }

  async signup(email, password, name, contact) {
    try {
      let hashedPassword = await bcrypt.hashSync(password, 8);
      const newUser = this.userModel({
        email,
        password: hashedPassword,
        name,
        contact,
      });
      await newUser.save();
      return { msg: ResponseMsgs.Created };
    } catch (error) {
      throw new BadRequestException(ResponseMsgs.Exist);
    }
  }
}
