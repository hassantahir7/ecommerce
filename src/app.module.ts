import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ImageModule } from './image/image.module';
import { AuthModule } from './auth/auth.module';
import { MailerModule } from './mailer/mailer.module';
import { ConfigModule } from '@nestjs/config';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { ProductVariantsModule } from './product_variants/product_variants.module';
import { CartItemsModule } from './cart_items/cart_items.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    ImageModule,
    AuthModule,
    MailerModule,
    CategoriesModule,
    ProductsModule,
    ProductVariantsModule,
    CartItemsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
