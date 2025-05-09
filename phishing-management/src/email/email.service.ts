import axios from 'axios';
import { Injectable, NotFoundException, Logger, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EmailRepository } from './email.repository';
import { SendEmailDto } from './dto/send-email.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(
    private configService: ConfigService,
    private emailRepository: EmailRepository,
    private usersService: UsersService,
  ) {
  }

  async sendEmail(userId: string, sendEmailDto: SendEmailDto) {
    try {
      this.logger.log(`Attempting to send email to user with ID: ${userId}`);
      const user = await this.usersService.findById(userId);
      
      const response = await axios.post(this.configService.get('EMAIL_SERVICE_URL'), {
        email: user.email,
        subject: sendEmailDto.subject,
        content: sendEmailDto.content,
      });
      
      this.logger.log(`Email sent successfully to ${user.email}`);
      return response;
    } catch (error) {
      if (error instanceof NotFoundException) {
        this.logger.error(`User not found: ${userId}`);
        throw error;
      }
      
      this.logger.error(`Failed to send email to user ${userId}: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to send email');
    }
  }

  async getPhishingAttempts(userId: string) {
    try {
      this.logger.log(`Fetching phishing attempts for user: ${userId}`);
      const attempts = await this.emailRepository.findEmailsForUser(userId);
      this.logger.log(`Found ${attempts.length} phishing attempts for user: ${userId}`);
      return attempts;
    } catch (error) {
      this.logger.error(`Failed to fetch phishing attempts for user ${userId}: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to retrieve phishing attempts');
    }
  }

  async getPhishingAttemptById(id: string) {
    try {
      this.logger.log(`Fetching phishing attempt with ID: ${id}`);
      const attempt = await this.emailRepository.findEmailById(id);
      
      if (!attempt) {
        this.logger.warn(`Phishing attempt not found with ID: ${id}`);
        throw new NotFoundException('Phishing attempt not found');
      }
      
      this.logger.log(`Successfully retrieved phishing attempt: ${id}`);
      return attempt;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      
      this.logger.error(`Failed to fetch phishing attempt ${id}: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to retrieve phishing attempt');
    }
  }
}
