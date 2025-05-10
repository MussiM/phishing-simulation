import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { Email } from '../common/database/entities/email.entity';
import { ObjectId } from 'mongodb';

@Injectable()
export class EmailRepository {
  private readonly logger = new Logger(EmailRepository.name);
  
  constructor(
    @InjectRepository(Email)
    private emailRepository: MongoRepository<Email>,
  ) {}

  async findEmailById(id: string) {
    try {
      this.logger.log(`Finding email with ID: ${id}`);
      return await this.emailRepository.findOne({ where: { _id: id } });
    } catch (error) {
      this.logger.error(`Error finding email with ID ${id}: ${error.message}`);
      throw error;
    }
  }

  async updateEmailStatus(id: ObjectId, status: string) {
    try {
      this.logger.log(`Updating email status: ID=${id}, status=${status}`);
      const email = await this.emailRepository.findOne({ where: { _id: id } });
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

  async updateEmailClicks(id: ObjectId) {
    try {
      this.logger.log(`Updating email clicks: ID=${id}`);
      const email = await this.emailRepository.findOne({ where: { _id: id } });
      if (!email) {
        throw new Error(`Email with ID ${id} not found`); 
      }

      if (!email.clicks) {
        email.clicks = 0;
      }
      
      email.clicks++;
      email.updatedAt = new Date();

      return await this.emailRepository.save(email);
    } catch (error) {
      this.logger.error(`Error updating email clicks for ID ${id}: ${error.message}`);
      throw error;
    }
  }
} 