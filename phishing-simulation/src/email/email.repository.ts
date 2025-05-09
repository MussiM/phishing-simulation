import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { Email } from '../common/database/entities/email.entity';
import { User } from '../common/database/entities/user.entity';

@Injectable()
export class EmailRepository {
  private readonly logger = new Logger(EmailRepository.name);
  
  constructor(
    @InjectRepository(Email)
    private emailRepository: MongoRepository<Email>,
    @InjectRepository(User)
    private userRepository: MongoRepository<User>
  ) {}

  async findUserById(id: string) {
    try {
      this.logger.log(`Finding user with ID: ${id}`);
      return await this.userRepository.findOne({ where: { id } });
    } catch (error) {
      this.logger.error(`Error finding user with ID ${id}: ${error.message}`);
      throw error;
    }
  }

  async findEmailById(id: string) {
    try {
      this.logger.log(`Finding email with ID: ${id}`);
      return await this.emailRepository.findOne({ where: { id } });
    } catch (error) {
      this.logger.error(`Error finding email with ID ${id}: ${error.message}`);
      throw error;
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
} 