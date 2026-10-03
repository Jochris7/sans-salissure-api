import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import type { ServiceVariant } from './ServiceVariant';
import { DEFAULT_SERVICE_ICON, type ServiceIconName } from './service-icons';

@Entity({ name: 'Service' })
export class Service {
  @PrimaryColumn({ type: 'text' })
  id!: string;

  @Column({ type: 'text' })
  label!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column({ type: 'boolean', default: false })
  devis!: boolean;

  // Nom d'icône lucide-react (voir service-icons.ts pour la liste fermée) —
  // choisi par l'admin à la création, affiché tel quel côté client.
  @Column({ type: 'text', default: DEFAULT_SERVICE_ICON })
  icon!: ServiceIconName;

  // Relation ciblée par nom de chaîne (pas par référence de classe) : Service
  // et ServiceVariant s'importent mutuellement, une référence directe créerait
  // un cycle ESM au runtime ("Cannot access 'X' before initialization").
  @OneToMany('ServiceVariant', 'service')
  variants!: ServiceVariant[];
}
