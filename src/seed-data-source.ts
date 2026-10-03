// DataSource TypeORM autonome, utilisé uniquement par scripts/seed.ts (en
// dehors du conteneur d'injection de dépendances de Nest, pour un script
// simple exécuté une fois).
import 'reflect-metadata';
import * as dotenv from 'dotenv';
dotenv.config();

import { DataSource } from 'typeorm';
import { Quartier } from './entities/Quartier';
import { Service } from './entities/Service';
import { ServiceVariant } from './entities/ServiceVariant';
import { Order } from './entities/Order';
import { OrderLine } from './entities/OrderLine';
import { Subscription } from './entities/Subscription';
import { Prestataire } from './entities/Prestataire';
import { AdminUser } from './entities/AdminUser';

export const SeedDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
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
  synchronize: false,
});
