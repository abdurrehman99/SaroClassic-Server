import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';
const jwt = require('jsonwebtoken');

@Injectable()
export class authMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: Function) {
    const header = req.headers.authorization;
    if (header) {
      const token = header.split(' ');
      try {
        // console.log(token[1]);
        const decode = jwt.verify(token[1], 'secret');
        console.log('check token', decode);
        next();
      } catch (error) {
        throw new UnauthorizedException('Invalid (or) Expired token !');
      }
    } else {
      throw new UnauthorizedException('Token not found in header !');
    }
  }
}
