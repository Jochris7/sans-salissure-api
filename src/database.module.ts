import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Quartier } from './entities/Quartier';
import { Service } from './entities/Service';
import { ServiceVariant } from './entities/ServiceVariant';
import { Order } from './entities/Order';
import { OrderLine } from './entities/OrderLine';
import { Subscription } from './entities/Subscription';
import { Prestataire } from './entities/Prestataire';
import { AdminUser } from './entities/AdminUser';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.getOrThrow<string>('DATABASE_URL'),
        entities: [
          Quartier,
          Service,
          ServiceVariant,
          Order,
          OrderLine,
          Subscription,
          Prestataire,
          AdminUser,
        ],
        // Les tables existent déjà (créées par migration) ; on ne modifie
        // jamais le schéma automatiquement.
        //synchronize: false,
        synchronize: true,
      }),
    }),
  ],
})
export class DatabaseModule {}
