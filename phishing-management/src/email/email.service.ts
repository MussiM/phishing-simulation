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
  ) {
  }

  async sendEmail(userId: string, sendEmailDto: SendEmailDto) {
    try {
      this.logger.log(`Sending email to ${sendEmailDto.recipient}`);

      const email = await this.emailRepository.createEmail({...sendEmailDto, senderId: userId});
      
      const response = await axios.post(this.configService.get('EMAIL_SERVICE_URL'), {
        emailId: email.id,
        recipient: sendEmailDto.recipient,
        subject: sendEmailDto.subject,
        content: sendEmailDto.content,
      });
      
      this.logger.log(`Email sent successfully to ${sendEmailDto.recipient}`);
      return response;
    } catch (error) {
      this.logger.error(`Failed to send email to: ${error.message}`, error.stack);
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

  async updatePhishingAttempt(id: string) {
    try {
      this.logger.log(`Updating phishing attempt with ID: ${id}`);
      const attempt = await this.emailRepository.findEmailById(id);
      
      if (!attempt) { 
        this.logger.warn(`Phishing attempt not found with ID: ${id}`);
        throw new NotFoundException('Phishing attempt not found');
      }
      
      await this.emailRepository.updateEmailStatus(id, 'clicked');
      this.logger.log(`Phishing attempt updated to clicked: ${id}`);
      return attempt;
    } catch (error) {
      this.logger.error(`Failed to update phishing attempt ${id}: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to update phishing attempt');
    }
  }
}
