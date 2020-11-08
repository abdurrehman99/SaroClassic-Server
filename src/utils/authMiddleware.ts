import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

@Injectable()
export class authMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: Function) {
    const header = req.headers.authorization;
    console.log('token', header);
    if (header) {
      const token = header.split(' ');
      try {
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
