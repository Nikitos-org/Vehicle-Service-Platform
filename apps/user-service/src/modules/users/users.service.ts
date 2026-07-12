import { Injectable, NotFoundException } from '@nestjs/common';
import {
  PaginateQueryDto,
  PaginateService,
} from '@vsp/backend-shared/paginate';

import { PrismaService } from '../../infrastructure/prisma/prisma.service.js';
import { CreateUserDto, UpdateUserDto } from './users.dto.js';
import { UsersEventsPublisher } from './users.producer.js';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersEventsPublisher: UsersEventsPublisher,
    private readonly paginateService: PaginateService,
  ) {}

  async create(dto: CreateUserDto, adminId: string) {
    const user = await this.prisma.user.create({
      data: {
        ...dto,
        createdByAdminId: adminId,
      },
    });

    await this.usersEventsPublisher.publishUserCreated(user);
    return user;
  }

  async findAll(query: PaginateQueryDto, adminId: string) {
    const pagination = this.paginateService.resolve({
      page: query.page,
      pageSize: query.pageSize,
    });

    const where = {
      createdByAdminId: adminId,
    };

    const [users, totalItems] = await Promise.all([
      this.prisma.user.findMany({
        where,
        orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
        skip: pagination.skip,
        take: pagination.take,
      }),
      this.prisma.user.count({
        where,
      }),
    ]);

    return this.paginateService.buildPaginatedResult({
      items: users,
      page: pagination.page,
      pageSize: pagination.pageSize,
      totalItems,
    });
  }

  findOneById(id: string, adminId: string) {
    return this.findOwnedByIdOrThrow(id, adminId);
  }

  async updateById(id: string, dto: UpdateUserDto, adminId: string) {
    await this.findOwnedByIdOrThrow(id, adminId);

    return this.prisma.user.update({
      where: { id },
      data: dto,
    });
  }

  async deleteById(id: string, adminId: string) {
    await this.findOwnedByIdOrThrow(id, adminId);

    return this.prisma.user.delete({
      where: { id },
    });
  }

  private async findOwnedByIdOrThrow(id: string, adminId: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        id,
        createdByAdminId: adminId,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}
