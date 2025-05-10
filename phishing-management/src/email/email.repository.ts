import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
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

  async findEmailsForUser(userId: string) {
    try {
      this.logger.log(`Finding emails for user: ${userId}`);
      return await this.emailRepository.find({
        where: { senderId: userId },
      });
    } catch (error) {
      this.logger.error(`Error finding emails for user ${userId}: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to find emails for user');
    }
  }

  async findEmailById(id: string) {
    try {
      this.logger.log(`Finding email by ID: ${id}`);
      return await this.emailRepository.findOne({ where: { _id: id } });
    } catch (error) {
      this.logger.error(`Error finding email by ID ${id}: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to find email');
    }
  }
  
  async saveEmail(emailData: any) {
    try {
      this.logger.log(`Saving email to database`);
      const email = this.emailRepository.create(emailData);
      const savedEmail = await this.emailRepository.save(email);
      return savedEmail;
    } catch (error) {
      this.logger.error(`Error saving email to database: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to save email');
    }
  }
}
