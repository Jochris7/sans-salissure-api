import { randomUUID } from 'node:crypto';
import {
  Entity,
  PrimaryColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  BeforeInsert,
} from 'typeorm';
import type { OrderLine } from './OrderLine';

export enum PaymentTiming {
  avant = 'avant',
  apres = 'apres',
}

export enum PaymentMethod {
  wave = 'wave',
  orange_money = 'orange_money',
  liquide = 'liquide',
}

export enum OrderStatus {
  nouvelle = 'nouvelle',
  en_cours = 'en_cours',
  terminee = 'terminee',
  payee = 'payee',
}

// Le pipeline avance dans cet ordre — c'est le prestataire sur le terrain qui
// déclenche les transitions, avec un rattrapage manuel possible côté admin.
@Entity({ name: 'Order' })
export class Order {
  @PrimaryColumn({ type: 'text' })
  id!: string;

  @Column({ type: 'text', unique: true })
  ref!: string;

  @Column({ type: 'text' })
  clientName!: string;

  @Column({ type: 'text' })
  phone!: string;

  @Column({ type: 'text' })
  quartierId!: string;

  @Column({ type: 'timestamp' })
  datetime!: Date;

  @Column({ type: 'enum', enum: PaymentTiming, enumName: 'PaymentTiming' })
  paymentTiming!: PaymentTiming;

  @Column({ type: 'enum', enum: PaymentMethod, enumName: 'PaymentMethod' })
  paymentMethod!: PaymentMethod;

  @Column({ type: 'boolean', default: false })
  paidUpfront!: boolean;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    enumName: 'OrderStatus',
    default: OrderStatus.nouvelle,
  })
  status!: OrderStatus;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  // Prestataire ayant pris la commande en charge — null tant que personne ne
  // l'a prise sur le terrain. FK ON DELETE SET NULL côté base.
  @Column({ type: 'text', nullable: true })
  assignedToId!: string | null;

  @OneToMany('OrderLine', 'order')
  lines!: OrderLine[];

  @BeforeInsert()
  assignId() {
    if (!this.id) this.id = randomUUID();
  }
}
