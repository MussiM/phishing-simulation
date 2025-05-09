import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class EmailRepository {
  private readonly logger = new Logger(EmailRepository.name);
  
  constructor(private prisma: PrismaService) {}

  async findUserById(id: string) {
    try {
      this.logger.debug(`Finding user with ID: ${id}`);
      return await this.prisma.user.findUnique({
        where: { id },
      });
    } catch (error) {
      this.logger.error(`Error finding user with ID ${id}: ${error.message}`);
      throw error;
    }
  }

  async findEmailById(id: string) {
    try {
      this.logger.debug(`Finding email with ID: ${id}`);
      return await this.prisma.email.findUnique({
        where: { id },
      });
    } catch (error) {
      this.logger.error(`Error finding email with ID ${id}: ${error.message}`);
      throw error;
    }
  }

  async updateEmailStatus(id: string, status: string) {
    try {
      this.logger.debug(`Updating email status: ID=${id}, status=${status}`);
      return await this.prisma.email.update({
        where: { id },
        data: { 
          deliveryStatus: status,
          updatedAt: new Date()
        },
      });
    } catch (error) {
      this.logger.error(`Error updating email status for ID ${id}: ${error.message}`);
      throw error;
    }
  }
} 