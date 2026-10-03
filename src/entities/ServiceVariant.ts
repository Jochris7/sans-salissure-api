import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import type { Service } from './Service';

// Id de variante unique seulement PAR service (ex: "voiture"+"grand" et
// "tapis"+"grand" coexistent) — clé composite (serviceId, id), pas de PK globale.
@Entity({ name: 'ServiceVariant' })
export class ServiceVariant {
  @PrimaryColumn({ type: 'text' })
  serviceId!: string;

  @PrimaryColumn({ type: 'text' })
  id!: string;

  @Column({ type: 'text' })
  label!: string;

  @Column({ type: 'integer' })
  price!: number;

  @ManyToOne('Service', 'variants', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'serviceId' })
  service!: Service;
}
