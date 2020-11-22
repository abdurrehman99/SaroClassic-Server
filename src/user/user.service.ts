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
import jwtDecode from 'jwt-decode';

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async decodeUserData(token) {
    const decodeUser: { email: string } = jwtDecode(token);
    const { email } = decodeUser;
    let user = await this.userModel.findOne({ email });
    if (user) {
      throw new HttpException(
        {
          statusCode: HttpStatus.OK,
          user,
        },
        HttpStatus.OK,
      );
    } else {
      throw new BadRequestException();
    }
  }
  async login(email, password) {
    let user = await this.userModel.findOne({ email });
    const { contact, name, shippingAddress } = user;
    if (user) {
      let passwordMatched = await bcrypt.compareSync(password, user.password);
      if (passwordMatched) {
        const token = jwt.sign(
          { email, contact, name, shippingAddress },
          'secret',
          {
            expiresIn: '24h',
          },
        );
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
    let exist = await this.userModel.findOne({ email });
    console.log(exist);
    if (exist) throw new BadRequestException(ResponseMsgs.Exist);
    else {
      let hashedPassword = await bcrypt.hashSync(password, 8);
      const newUser = this.userModel({
        email,
        password: hashedPassword,
        name,
        contact,
      });
      await newUser.save();
      return { msg: ResponseMsgs.Created };
    }
  }
  async updateProfile(email, name, contact, shippingAddress) {
    let updateData = {
      email: email ? email : null,
      name: name ? name : null,
      contact: contact ? contact : null,
      shippingAddress: shippingAddress ? shippingAddress : null,
    };
    let user = await this.userModel.findOneAndUpdate({ email }, updateData);
    if (user) {
      throw new HttpException(
        {
          statusCode: HttpStatus.OK,
          user,
        },
        HttpStatus.OK,
      );
    } else {
      throw new BadRequestException();
    }
  }

  async updatePassword(email, oldPassword, newPassword) {
    let user = await this.userModel.findOne({ email });
    let hashedPassword = await bcrypt.hashSync(newPassword, 8);

    if (user) {
      let passwordMatched = await bcrypt.compareSync(
        oldPassword,
        user.password,
      );
      if (passwordMatched) {
        let updated = await this.userModel.findOneAndUpdate(
          { email },
          { password: hashedPassword },
        );
        if (updated) {
          throw new HttpException(
            {
              statusCode: HttpStatus.OK,
              msg: ResponseMsgs.passwordChanged,
            },
            HttpStatus.OK,
          );
        } else {
          throw new BadRequestException();
        }
      } else {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            error: ResponseMsgs.passwordNotChanged,
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  }
}
