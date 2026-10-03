import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database.module';
import { AuthModule } from './auth/auth.module';
import { QuartiersModule } from './quartiers/quartiers.module';
import { CatalogModule } from './catalog/catalog.module';
import { OrdersModule } from './orders/orders.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { PrestatairesModule } from './prestataires/prestataires.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    AuthModule,
    QuartiersModule,
    CatalogModule,
    OrdersModule,
    SubscriptionsModule,
    PrestatairesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
