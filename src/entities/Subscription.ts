import { randomUUID } from 'node:crypto';
import { Entity, PrimaryColumn, Column, BeforeInsert } from 'typeorm';

@Entity({ name: 'Subscription' })
export class Subscription {
  @PrimaryColumn({ type: 'text' })
  id!: string;

  @Column({ type: 'text' })
  clientName!: string;

  @Column({ type: 'text' })
  phone!: string;

  @Column({ type: 'text' })
  serviceId!: string;

  @Column({ type: 'text' })
  variantId!: string;

  @Column({ type: 'text' })
  quartierId!: string;

  @Column({ type: 'integer' })
  frequencyPerWeek!: number;

  @Column({ type: 'boolean', default: true })
  active!: boolean;

  @BeforeInsert()
  assignId() {
    if (!this.id) this.id = randomUUID();
  }
}
