import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminSchema } from './../models/Admin.schema';
import { CategorySchema } from './../models/Category.schema';
import { ProductSchema } from './../models/Product.schema';
import { authMiddleware } from '../utils/authMiddleware';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Admin', schema: AdminSchema },
      { name: 'Category', schema: CategorySchema },
      { name: 'Product', schema: ProductSchema },
    ]),
  ],
  providers: [AdminService],
  controllers: [AdminController],
})
export class AdminModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer
  //     .apply(authMiddleware)
  //     .exclude(
  //       { path: '/admin/login', method: RequestMethod.POST },
  //       { path: '/admin/create', method: RequestMethod.POST },
  //       { path: '/admin/getAllCategories', method: RequestMethod.GET },
  //     )
  //     .forRoutes(AdminController);
  // }
}
