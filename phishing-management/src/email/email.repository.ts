import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class EmailRepository {
  constructor(private prisma: PrismaService) {}

  async findUserById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findEmailById(id: string) {
    return this.prisma.email.findUnique({
      where: { id },
    });
  }

  async updateEmailStatus(id: string, status: string) {
    return this.prisma.email.update({
      where: { id },
      data: { 
        deliveryStatus: status,
        updatedAt: new Date()
      },
    });
  }
} 