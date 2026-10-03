// Liste fermée des icônes que l'admin peut choisir pour un service (voir
// lib/icons.ts côté frontend pour la correspondance vers les composants
// lucide-react réels — cette liste doit rester synchronisée avec celle-là).
export const SERVICE_ICON_NAMES = [
  'Car',
  'Sofa',
  'Armchair',
  'LayoutGrid',
  'Shirt',
  'Home',
  'Droplet',
  'Sparkles',
  'WashingMachine',
  'Bed',
  'SprayCan',
  'Brush',
] as const;

export type ServiceIconName = (typeof SERVICE_ICON_NAMES)[number];

export const DEFAULT_SERVICE_ICON: ServiceIconName = 'Sparkles';
