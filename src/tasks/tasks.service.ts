import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';

import { CreateTaskDto } from './dto/create-task.dto';

import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    private prisma: PrismaService,
  ) {}

  create(
    dto: CreateTaskDto,
    userId: number,
  ) {
    return this.prisma.task.create({
      data: {
        ...dto,

        userId,
      },
    });
  }

  getAll(
    userId: number,

    query: {
      search?: string;

      page?: number;

      limit?: number;

      completed?: string;

      priority?: string;

      sort?: 'asc' | 'desc';
    },
  ) {
    const {
      search,

      page = 1,

      limit = 5,

      completed,

      priority,

      sort = 'desc',
    } = query;

    return this.prisma.task.findMany({
      where: {
        userId,

        ...(search && {
          OR: [
            {
              title: {
                contains: search,

                mode: 'insensitive',
              },
            },

            {
              description: {
                contains: search,

                mode: 'insensitive',
              },
            },
          ],
        }),

        ...(completed && {
          completed:
            completed === 'true',
        }),

        ...(priority && {
          priority,
        }),
      },

      orderBy: {
        createdAt: sort,
      },

      skip: (page - 1) * limit,

      take: limit,
    });
  }

  async update(
    id: number,
    dto: UpdateTaskDto,
    userId: number,
  ) {
    const task =
      await this.prisma.task.findUnique({
        where: { id },
      });

    if (!task) {
      throw new NotFoundException(
        'Task not found',
      );
    }

    if (task.userId !== userId) {
      throw new ForbiddenException(
        'Access denied',
      );
    }

    return this.prisma.task.update({
      where: { id },

      data: dto,
    });
  }

  async delete(
    id: number,
    userId: number,
  ) {
    const task =
      await this.prisma.task.findUnique({
        where: { id },
      });

    if (!task) {
      throw new NotFoundException(
        'Task not found',
      );
    }

    if (task.userId !== userId) {
      throw new ForbiddenException(
        'Access denied',
      );
    }

    return this.prisma.task.delete({
      where: { id },
    });
  }
}