import { randomUUID } from 'node:crypto';
import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
} from 'typeorm';
import type { Order } from './Order';

@Entity({ name: 'OrderLine' })
export class OrderLine {
  @PrimaryColumn({ type: 'text' })
  id!: string;

  @Column({ type: 'text' })
  orderId!: string;

  @Column({ type: 'text' })
  serviceId!: string;

  @Column({ type: 'text' })
  variantId!: string;

  @Column({ type: 'integer' })
  quantity!: number;

  @ManyToOne('Order', 'lines', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'orderId' })
  order!: Order;

  @BeforeInsert()
  assignId() {
    if (!this.id) this.id = randomUUID();
  }
}
