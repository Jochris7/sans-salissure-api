import { randomUUID } from 'node:crypto';
import { Entity, PrimaryColumn, Column, BeforeInsert } from 'typeorm';

@Entity({ name: 'AdminUser' })
export class AdminUser {
  @PrimaryColumn({ type: 'text' })
  id!: string;

  @Column({ type: 'text', unique: true })
  email!: string;

  @Column({ type: 'text' })
  passwordHash!: string;

  @BeforeInsert()
  assignId() {
    if (!this.id) this.id = randomUUID();
  }
}
