import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class EmailRepository {
  constructor(private prisma: PrismaService) {}

  async findUserById(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
    });
  }

  async findEmailsForUser(userId: string) {
    return this.prisma.email.findMany({
      where: {
        senderId: userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findEmailById(id: string) {
    return this.prisma.email.findUnique({
      where: { id },
    });
  }
} 