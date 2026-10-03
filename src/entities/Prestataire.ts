import { randomUUID } from 'node:crypto';
import { Entity, PrimaryColumn, Column, BeforeInsert } from 'typeorm';

// Compte "semi-admin" : agent de terrain, créé par l'admin. Accès
// volontairement limité côté API (jamais de droit sur les tarifs) — voir
// StaffGuard / la règle métier appliquée dans OrdersService.updateOrder().
@Entity({ name: 'Prestataire' })
export class Prestataire {
  @PrimaryColumn({ type: 'text' })
  id!: string;

  @Column({ type: 'text' })
  name!: string;

  @Column({ type: 'text', unique: true })
  phone!: string;

  @Column({ type: 'text' })
  pinHash!: string;

  @Column({ type: 'boolean', default: true })
  active!: boolean;

  @BeforeInsert()
  assignId() {
    if (!this.id) this.id = randomUUID();
  }
}
