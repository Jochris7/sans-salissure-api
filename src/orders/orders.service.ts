import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import {
  Order,
  OrderStatus,
  PaymentMethod,
  PaymentTiming,
} from '../entities/Order';
import { OrderLine } from '../entities/OrderLine';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import type { StaffSession } from '../auth/types';

function generateRef(): string {
  return `SS-${Date.now().toString().slice(-6)}`;
}

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private readonly orderRepo: Repository<Order>,
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {}

  findAll(): Promise<Order[]> {
    return this.orderRepo.find({
      relations: { lines: true },
      order: { createdAt: 'DESC' },
    });
  }

  // Pas d'authentification ici : c'est le client (sans compte) qui réserve
  // depuis /reservation. La commande démarre toujours "nouvelle" et non
  // assignée — c'est un prestataire qui la prendra en charge ensuite.
  async create(dto: CreateOrderDto): Promise<Order> {
    const { cart, ...rest } = dto;
    const paidUpfront = rest.paymentTiming === 'avant';

    return this.dataSource.transaction(async (manager) => {
      const order = manager.create(Order, {
        ref: generateRef(),
        clientName: rest.clientName,
        phone: rest.phone,
        quartierId: rest.quartierId,
        datetime: new Date(rest.datetime),
        paymentTiming: rest.paymentTiming as PaymentTiming,
        paymentMethod: rest.paymentMethod as PaymentMethod,
        paidUpfront,
        status: OrderStatus.nouvelle,
        assignedToId: null,
      });
      const saved = await manager.save(Order, order);

      const lines = cart.map((line) =>
        manager.create(OrderLine, { orderId: saved.id, ...line }),
      );
      saved.lines = await manager.save(OrderLine, lines);
      return saved;
    });
  }

  // Un prestataire ne peut toucher que ses propres commandes, ou en prendre
  // une de libre (assignedToId encore null) — jamais réassigner ou modifier
  // une commande qui appartient à quelqu'un d'autre. L'admin n'a aucune
  // restriction (c'est lui qui supervise/réassigne).
  async update(
    id: string,
    dto: UpdateOrderDto,
    staff: StaffSession,
  ): Promise<Order> {
    const order = await this.orderRepo.findOneBy({ id });
    if (!order) throw new NotFoundException('Commande introuvable');

    if (staff.role === 'prestataire') {
      const myId = staff.session.prestataireId;
      const isMine = order.assignedToId === myId;
      const isClaimingFree =
        order.assignedToId === null && dto.assignedToId === myId;
      if (!isMine && !isClaimingFree) {
        throw new ForbiddenException(
          "Vous n'êtes pas autorisé à modifier cette commande",
        );
      }
      if (dto.assignedToId !== undefined && dto.assignedToId !== myId) {
        throw new ForbiddenException(
          "Un prestataire ne peut s'assigner qu'à lui-même",
        );
      }
    }

    const updateData: Partial<Order> = {};
    if (dto.status !== undefined) updateData.status = dto.status;
    if (dto.assignedToId !== undefined)
      updateData.assignedToId = dto.assignedToId;

    await this.orderRepo.update({ id }, updateData);
    return this.orderRepo.findOne({
      where: { id },
      relations: { lines: true },
    }) as Promise<Order>;
  }
}
