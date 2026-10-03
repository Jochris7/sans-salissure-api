import * as bcrypt from 'bcryptjs';
import { SeedDataSource } from '../src/seed-data-source';
import { Quartier } from '../src/entities/Quartier';
import { Service } from '../src/entities/Service';
import { ServiceVariant } from '../src/entities/ServiceVariant';
import { Order, OrderStatus, PaymentMethod, PaymentTiming } from '../src/entities/Order';
import { OrderLine } from '../src/entities/OrderLine';
import { Subscription } from '../src/entities/Subscription';
import { Prestataire } from '../src/entities/Prestataire';
import { AdminUser } from '../src/entities/AdminUser';
import type { ServiceIconName } from '../src/entities/service-icons';

const QUARTIERS = [
  { id: 'immobilier4', label: 'Immobilier 4', price: 500 },
  { id: 'immobilier5', label: 'Immobilier 5', price: 500 },
  { id: 'immobilier6', label: 'Immobilier 6', price: 500 },
  { id: 'oribat-fehkesse', label: 'Oribat - Feh Kessé', price: 500 },
  { id: 'synatresor', label: 'Synatresor', price: 500 },
  { id: 'colombe-fehkesse', label: 'Colombe - Feh Kessé', price: 500 },
  { id: 'fehkesse', label: 'Feh Kessé', price: 500 },
  { id: 'nouveaugoudron', label: 'Nouveau Goudron', price: 500 },
  { id: 'panneauorange', label: 'Panneau Orange', price: 500 },
  { id: 'julesvernelaurier', label: 'Jules Verne Laurier', price: 500 },
  { id: 'fdfp', label: 'FDFP', price: 500 },
  { id: 'marina', label: 'Marina', price: 500 },
  { id: 'promogym', label: 'Promogym', price: 500 },
];

const SERVICES = [
  {
    id: 'voiture',
    label: 'Lavage de voiture',
    description: 'Intérieur et extérieur complet, à domicile',
    devis: false,
    icon: 'Car',
    variants: [
      { id: 'grand', label: 'Grand véhicule (4x4, SUV...)', price: 2500 },
      { id: 'moyen', label: 'Moyen véhicule (mini SUV...)', price: 2300 },
      { id: 'petit', label: 'Petit véhicule (berline, coccinelle...)', price: 2000 },
      { id: 'moto', label: 'Moto', price: 1000 },
      { id: 'interieur-siege', label: 'Lavage en profondeur — siège', price: 15000 },
      { id: 'interieur-plafond', label: 'Lavage en profondeur — plafond', price: 5000 },
      { id: 'interieur-sol', label: 'Lavage en profondeur — sol', price: 3000 },
      {
        id: 'interieur-complet',
        label: 'Lavage en profondeur — siège + plafond + sol + extérieur',
        price: 20000,
      },
    ],
  },
  {
    id: 'fauteuil',
    label: 'Lavage de fauteuil',
    description: 'Shampoing et extraction, à domicile',
    devis: false,
    icon: 'Sofa',
    variants: [
      { id: 'place-1', label: 'Fauteuil 1 place', price: 5000 },
      { id: 'canape-2places', label: 'Canapé 2 places', price: 8000 },
      { id: 'canape-3places', label: 'Canapé 3 places', price: 10000 },
      { id: 'chaise', label: 'Chaise', price: 1000 },
      { id: 'chevet-lit', label: 'Chevet de lit', price: 5000 },
      { id: 'matelas', label: 'Matelas', price: 10000 },
    ],
  },
  {
    id: 'tapis',
    label: 'Lavage de tapis',
    description: 'Nettoyage en profondeur, à domicile',
    devis: false,
    icon: 'LayoutGrid',
    variants: [
      { id: 'grand', label: 'Grand tapis', price: 5000 },
      { id: 'moyen', label: 'Moyen tapis', price: 4000 },
      { id: 'petit', label: 'Petit tapis', price: 3500 },
    ],
  },
  {
    id: 'laverie',
    label: 'Laverie / Pressing',
    description: 'Ramassage et livraison de vos vêtements à domicile',
    devis: false,
    icon: 'Shirt',
    variants: [
      { id: 'vetement-simple', label: 'Chemise / polo / t-shirt / pantalon — laver simple', price: 300 },
      { id: 'vetement-repasse', label: 'Chemise / polo / t-shirt / pantalon — laver et repasser', price: 350 },
      { id: 'drap-serviette', label: 'Drap / serviette', price: 500 },
      { id: 'couette-simple', label: 'Couette simple', price: 2000 },
      { id: 'couette-grande', label: 'Couette grande', price: 5000 },
      { id: 'costume', label: 'Costume', price: 2000 },
      { id: 'robe-mariee-simple', label: 'Robe de mariée simple', price: 7000 },
      { id: 'robe-mariee-trainee', label: 'Robe de mariée avec traîne', price: 20000 },
      { id: 'robe-delicate-courte', label: 'Robe délicate courte', price: 1000 },
      { id: 'robe-delicate-longue', label: 'Robe délicate longue', price: 3500 },
      { id: 'chaussures-1paire', label: 'Chaussures — 1 paire', price: 1000 },
      { id: 'chaussures-3paires', label: 'Chaussures — lot de 3 paires', price: 2500 },
      { id: 'repassage-petit', label: 'Repassage seul — petite pièce', price: 150 },
      { id: 'repassage-grand', label: 'Repassage seul — grande pièce', price: 200 },
    ],
  },
  {
    id: 'maison',
    label: 'Lavage de maison',
    description: 'Nettoyage en profondeur, bureau et commerce',
    devis: true,
    icon: 'Home',
    variants: [] as { id: string; label: string; price: number }[],
  },
];

const PRESTATAIRES = [
  { id: 'p1', name: 'Koffi Yao', phone: '07 55 12 34 56', pin: '1234', active: true },
  { id: 'p2', name: 'Aminata Coulibaly', phone: '05 66 78 90 12', pin: '5678', active: true },
  { id: 'p3', name: 'Bakary Sanogo', phone: '01 77 23 45 67', pin: '9012', active: false },
];

const ORDERS = [
  {
    ref: 'SS-482913', clientName: 'Awa Traoré', phone: '07 12 34 56 78', quartierId: 'fehkesse',
    lines: [{ serviceId: 'voiture', variantId: 'grand', quantity: 1 }],
    datetime: '2026-08-25T09:00:00', paymentTiming: PaymentTiming.avant, paymentMethod: PaymentMethod.wave,
    paidUpfront: true, status: OrderStatus.nouvelle, assignedToId: null,
  },
  {
    ref: 'SS-482701', clientName: 'Yao Kouassi', phone: '07 01 02 03 04', quartierId: 'promogym',
    lines: [
      { serviceId: 'tapis', variantId: 'grand', quantity: 1 },
      { serviceId: 'tapis', variantId: 'petit', quantity: 2 },
    ],
    datetime: '2026-08-25T11:30:00', paymentTiming: PaymentTiming.apres, paymentMethod: PaymentMethod.liquide,
    paidUpfront: false, status: OrderStatus.nouvelle, assignedToId: null,
  },
  {
    ref: 'SS-481900', clientName: 'Fatou Diabaté', phone: '07 98 76 54 32', quartierId: 'immobilier5',
    lines: [{ serviceId: 'laverie', variantId: 'vetement-repasse', quantity: 4 }],
    datetime: '2026-08-25T14:00:00', paymentTiming: PaymentTiming.apres, paymentMethod: PaymentMethod.orange_money,
    paidUpfront: false, status: OrderStatus.en_cours, assignedToId: 'p1',
  },
  {
    ref: 'SS-481755', clientName: 'Jean Kouadio', phone: '05 44 55 66 77', quartierId: 'nouveaugoudron',
    lines: [{ serviceId: 'fauteuil', variantId: 'canape-2places', quantity: 1 }],
    datetime: '2026-08-25T10:00:00', paymentTiming: PaymentTiming.avant, paymentMethod: PaymentMethod.orange_money,
    paidUpfront: true, status: OrderStatus.en_cours, assignedToId: 'p2',
  },
  {
    ref: 'SS-480410', clientName: 'Marie Konan', phone: '01 23 45 67 89', quartierId: 'immobilier4',
    lines: [{ serviceId: 'voiture', variantId: 'petit', quantity: 1 }],
    datetime: '2026-08-24T16:00:00', paymentTiming: PaymentTiming.apres, paymentMethod: PaymentMethod.liquide,
    paidUpfront: false, status: OrderStatus.terminee, assignedToId: 'p1',
  },
  {
    ref: 'SS-480288', clientName: 'Ibrahim Cissé', phone: '07 65 43 21 09', quartierId: 'marina',
    lines: [
      { serviceId: 'laverie', variantId: 'costume', quantity: 3 },
      { serviceId: 'laverie', variantId: 'drap-serviette', quantity: 2 },
    ],
    datetime: '2026-08-24T13:00:00', paymentTiming: PaymentTiming.avant, paymentMethod: PaymentMethod.wave,
    paidUpfront: true, status: OrderStatus.terminee, assignedToId: 'p2',
  },
  {
    ref: 'SS-479120', clientName: "Koffi N'Guessan", phone: '07 11 22 33 44', quartierId: 'fehkesse',
    lines: [{ serviceId: 'voiture', variantId: 'moto', quantity: 1 }],
    datetime: '2026-08-23T09:00:00', paymentTiming: PaymentTiming.apres, paymentMethod: PaymentMethod.liquide,
    paidUpfront: false, status: OrderStatus.payee, assignedToId: 'p1',
  },
  {
    ref: 'SS-478990', clientName: 'Adjoua Bamba', phone: '05 90 80 70 60', quartierId: 'panneauorange',
    lines: [{ serviceId: 'tapis', variantId: 'moyen', quantity: 1 }],
    datetime: '2026-08-22T15:00:00', paymentTiming: PaymentTiming.avant, paymentMethod: PaymentMethod.wave,
    paidUpfront: true, status: OrderStatus.payee, assignedToId: 'p2',
  },
  {
    ref: 'SS-478602', clientName: 'Salif Ouattara', phone: '07 33 22 11 00', quartierId: 'julesvernelaurier',
    lines: [{ serviceId: 'fauteuil', variantId: 'canape-3places', quantity: 1 }],
    datetime: '2026-08-21T10:00:00', paymentTiming: PaymentTiming.apres, paymentMethod: PaymentMethod.orange_money,
    paidUpfront: false, status: OrderStatus.payee, assignedToId: 'p1',
  },
  {
    ref: 'SS-477811', clientName: 'Aya Kacou', phone: '01 55 44 33 22', quartierId: 'colombe-fehkesse',
    lines: [
      { serviceId: 'voiture', variantId: 'grand', quantity: 1 },
      { serviceId: 'laverie', variantId: 'vetement-repasse', quantity: 5 },
    ],
    datetime: '2026-08-19T09:30:00', paymentTiming: PaymentTiming.avant, paymentMethod: PaymentMethod.wave,
    paidUpfront: true, status: OrderStatus.payee, assignedToId: 'p3',
  },
];

const SUBSCRIPTIONS = [
  { clientName: 'Marie Konan', phone: '01 23 45 67 89', serviceId: 'voiture', variantId: 'petit', quartierId: 'immobilier4', frequencyPerWeek: 2, active: true },
  { clientName: 'Yao Kouassi', phone: '07 01 02 03 04', serviceId: 'voiture', variantId: 'grand', quartierId: 'promogym', frequencyPerWeek: 1, active: true },
  { clientName: 'Fatou Diabaté', phone: '07 98 76 54 32', serviceId: 'laverie', variantId: 'vetement-repasse', quartierId: 'immobilier5', frequencyPerWeek: 3, active: true },
  { clientName: 'Ibrahim Cissé', phone: '07 65 43 21 09', serviceId: 'voiture', variantId: 'moyen', quartierId: 'marina', frequencyPerWeek: 1, active: false },
];

async function main() {
  const ds = await SeedDataSource.initialize();

  console.log('Seed: admin...');
  const adminRepo = ds.getRepository(AdminUser);
  const adminEmail = 'admin@sanssalissure.ci';
  const existingAdmin = await adminRepo.findOneBy({ email: adminEmail });
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash('sansalissure2026', 10);
    await adminRepo.save(adminRepo.create({ email: adminEmail, passwordHash }));
  }

  console.log('Seed: quartiers...');
  const quartierRepo = ds.getRepository(Quartier);
  for (const q of QUARTIERS) {
    await quartierRepo.upsert(q, ['id']);
  }

  console.log('Seed: services + variantes...');
  const serviceRepo = ds.getRepository(Service);
  const variantRepo = ds.getRepository(ServiceVariant);
  for (const s of SERVICES) {
    await serviceRepo.upsert(
      {
        id: s.id,
        label: s.label,
        description: s.description,
        devis: s.devis,
        icon: s.icon as ServiceIconName,
      },
      ['id'],
    );
    for (const v of s.variants) {
      await variantRepo.upsert({ serviceId: s.id, id: v.id, label: v.label, price: v.price }, ['serviceId', 'id']);
    }
  }

  console.log('Seed: prestataires...');
  const prestataireRepo = ds.getRepository(Prestataire);
  for (const p of PRESTATAIRES) {
    const pinHash = await bcrypt.hash(p.pin, 10);
    await prestataireRepo.upsert({ id: p.id, name: p.name, phone: p.phone, pinHash, active: p.active }, ['id']);
  }

  console.log('Seed: commandes de démo...');
  const orderRepo = ds.getRepository(Order);
  const orderLineRepo = ds.getRepository(OrderLine);
  for (const o of ORDERS) {
    const existing = await orderRepo.findOneBy({ ref: o.ref });
    if (existing) continue;
    const order = await orderRepo.save(
      orderRepo.create({
        ref: o.ref,
        clientName: o.clientName,
        phone: o.phone,
        quartierId: o.quartierId,
        datetime: new Date(o.datetime),
        paymentTiming: o.paymentTiming,
        paymentMethod: o.paymentMethod,
        paidUpfront: o.paidUpfront,
        status: o.status,
        assignedToId: o.assignedToId,
      }),
    );
    await orderLineRepo.save(o.lines.map((line) => orderLineRepo.create({ orderId: order.id, ...line })));
  }

  console.log('Seed: abonnements de démo...');
  const subscriptionRepo = ds.getRepository(Subscription);
  for (const s of SUBSCRIPTIONS) {
    const existing = await subscriptionRepo.findOneBy({ clientName: s.clientName, serviceId: s.serviceId });
    if (existing) continue;
    await subscriptionRepo.save(subscriptionRepo.create(s));
  }

  console.log('Seed terminé.');
  await ds.destroy();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
