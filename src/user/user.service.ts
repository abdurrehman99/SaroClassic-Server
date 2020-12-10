import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotAcceptableException,
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

  async checkToken(token) {
    try {
      jwt.verify(token, process.env.JWT_SECRET);
      // return;
    } catch (error) {
      throw new BadRequestException(ResponseMsgs.tokenExpired);
    }
  }

  async decodeUserData(token) {
    const decodeUser: { email: string } = jwtDecode(token);
    const { email } = decodeUser;
    let user = await this.userModel.findOne({ email });
    // console.log(user);
    if (user) {
      user.password = '';

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
    if (email === 'admin@saroclassic.com') {
      throw new NotAcceptableException(ResponseMsgs.wrongCredentials);
    } else {
      let user = await this.userModel.findOne({ email });
      if (user) {
        const { contact, name, shippingAddress } = user;

        let passwordMatched = await bcrypt.compareSync(password, user.password);
        if (passwordMatched) {
          const token = jwt.sign(
            { email, contact, name, shippingAddress },
            process.env.JWT_SECRET,
            {
              expiresIn: '1h',
            },
          );
          user.password = '';
          throw new HttpException(
            {
              statusCode: HttpStatus.OK,
              token,
              user,
            },
            HttpStatus.OK,
          );
        } else throw new BadRequestException(ResponseMsgs.wrongCredentials);
      } else {
        throw new BadRequestException(ResponseMsgs.wrongCredentials);
      }
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
    let updateData = {};
    email ? (updateData['email'] = email) : null;
    name ? (updateData['name'] = name) : null;
    contact ? (updateData['contact'] = contact) : null;
    shippingAddress ? (updateData['shippingAddress'] = shippingAddress) : null;

    let updatedUser = await this.userModel.findOneAndUpdate(
      { email },
      updateData,
    );
    if (updatedUser) {
      const user = await this.userModel.findOne({ email });
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

  async updatePassword(email, passwordOld, passwordNew) {
    const user = await this.userModel.findOne({
      email,
    });
    // console.log(changed);
    if (user) {
      let passwordMatched = await bcrypt.compareSync(
        passwordOld,
        user.password,
      );
      if (passwordMatched) {
        let hashedPassword = bcrypt.hashSync(passwordNew, 8);

        let changed = await this.userModel.findOneAndUpdate({
          password: hashedPassword,
        });
        if (changed) {
          throw new HttpException(
            {
              statusCode: HttpStatus.OK,
              msg: ResponseMsgs.passwordChanged,
            },
            HttpStatus.OK,
          );
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
