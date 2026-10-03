import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity({ name: 'Quartier' })
export class Quartier {
  @PrimaryColumn({ type: 'text' })
  id!: string;

  @Column({ type: 'text' })
  label!: string;

  @Column({ type: 'integer' })
  price!: number;
}
