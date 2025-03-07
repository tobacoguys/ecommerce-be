import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as Joi from 'joi';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';
import { CmsModule } from './cms/cms.module';
import { CategoryModule } from './category/category.module';
import { CartController } from './cart/cart.controller';
import { CartService } from './cart/cart.service';
import { CartModule } from './cart/cart.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_DATABASE: Joi.string().required(),
        PORT: Joi.number(),
        isGlobal: true, 
        envFilePath: '.env', 
      }),
    }),
    DatabaseModule,
    UserModule,
    AuthModule,
    ProductModule,
    CmsModule,
    CategoryModule,
    CartModule,
  ],
  controllers: [AppController, CartController],
  providers: [AppService, CartService],
})
export class AppModule {}
