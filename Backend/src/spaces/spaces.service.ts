import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSpaceDto } from './dto/create-space.dto';
import { UpdateSpaceDto } from './dto/update-space.dto';

@Injectable()
export class SpacesService {
  constructor(private prisma: PrismaService) {}

  async create(createSpaceDto: CreateSpaceDto) {
    return this.prisma.space.create({
      data: createSpaceDto,
    });
  }

  async findAll() {
    return this.prisma.space.findMany({
      include: {
        _count: {
          select: {
            bookings: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const space = await this.prisma.space.findUnique({
      where: { id },
      include: {
        bookings: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          orderBy: {
            date: 'asc',
          },
        },
        _count: {
          select: {
            bookings: true,
          },
        },
      },
    });

    if (!space) {
      throw new NotFoundException(`Space with ID ${id} not found`);
    }

    return space;
  }

  async findByType(type: string) {
    return this.prisma.space.findMany({
      where: { type: type as any },
      include: {
        _count: {
          select: {
            bookings: true,
          },
        },
      },
    });
  }

  async update(id: string, updateSpaceDto: UpdateSpaceDto) {
    const space = await this.prisma.space.update({
      where: { id },
      data: updateSpaceDto,
    });

    if (!space) {
      throw new NotFoundException(`Space with ID ${id} not found`);
    }

    return space;
  }

  async remove(id: string) {
    const space = await this.prisma.space.delete({
      where: { id },
    });

    if (!space) {
      throw new NotFoundException(`Space with ID ${id} not found`);
    }

    return { message: 'Space deleted successfully' };
  }
}
















