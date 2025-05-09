import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { Email } from '../common/database/entities/email.entity';
import { User } from '../common/database/entities/user.entity';
import { SendEmailDto } from './dto/send-email.dto';

@Injectable()
export class EmailRepository {
  private readonly logger = new Logger(EmailRepository.name);

  constructor(
    @InjectRepository(Email)
    private emailRepository: MongoRepository<Email>,
    @InjectRepository(User)
    private userRepository: MongoRepository<User>,
  ) {}

  async findUserById(userId: string) {
    try {
      this.logger.log(`Finding user by ID: ${userId}`);
      return await this.userRepository.findOne({ where: { id: userId } });
    } catch (error) {
      this.logger.error(`Error finding user by ID ${userId}: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to find user');
    }
  }

  async updateEmailStatus(id: string, status: string) {
    try {
      this.logger.log(`Updating email status: ID=${id}, status=${status}`);
      const email = await this.emailRepository.findOne({ where: { id } });
      if (!email) {
        throw new Error(`Email with ID ${id} not found`);
      }
      
      email.deliveryStatus = status;
      email.updatedAt = new Date();
      
      return await this.emailRepository.save(email);
    } catch (error) {
      this.logger.error(`Error updating email status for ID ${id}: ${error.message}`);
      throw error;
    }
  }

  async createEmail(sendEmailDto: SendEmailDto & { senderId: string }) {
    try {
      this.logger.log(`Creating email: ${sendEmailDto.recipient}`);
      return await this.emailRepository.save(sendEmailDto);
    } catch (error) {
      this.logger.error(`Error creating email: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to create email');
    }
  }

  async findEmailsForUser(userId: string) {
    try {
      this.logger.log(`Finding emails for user: ${userId}`);
      return await this.emailRepository.find({
        where: { senderId: userId },
        order: { createdAt: 'DESC' },
      });
    } catch (error) {
      this.logger.error(`Error finding emails for user ${userId}: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to find emails for user');
    }
  }

  async findEmailById(id: string) {
    try {
      this.logger.log(`Finding email by ID: ${id}`);
      return await this.emailRepository.findOne({ where: { id } });
    } catch (error) {
      this.logger.error(`Error finding email by ID ${id}: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to find email');
    }
  }
} 