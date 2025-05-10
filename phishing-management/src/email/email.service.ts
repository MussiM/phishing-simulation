import axios from 'axios';
import { Injectable, NotFoundException, Logger, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EmailRepository } from './email.repository';
import { SendEmailDto } from './dto/send-email.dto';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(
    private configService: ConfigService,
    private emailRepository: EmailRepository,
  ) {
  }

  async sendEmail(sendEmailDto: SendEmailDto, userId: string) {
    try {
      this.logger.log(`Sending email to ${sendEmailDto.recipient} from user ${userId}`);
      
      const emailData = {
        recipient: sendEmailDto.recipient,
        senderId: userId,
        clicks: 0,
        status: 'pending'
      };
      
      const savedEmail = await this.emailRepository.saveEmail(emailData);
      
      const emailId = this.getIdFromEmail(savedEmail);
      
      const response = await axios.post(this.configService.get('EMAIL_SERVICE_URL'), {
        recipient: sendEmailDto.recipient,
        emailId,
        userId
      });
      
      this.logger.log(`Email sent successfully to ${sendEmailDto.recipient}`);
      return response.data;
    } catch (error) {
      this.logger.error(`Failed to send email: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to send email');
    }
  }

  private getIdFromEmail(email: any): string {
    if (!email) return 'unknown';
    
    try {
      if (email.id) {
        return email.id;
      }
      
      return 'unknown';
    } catch (error) {
      this.logger.warn(`Error getting ID from email: ${error.message}`);
      return 'unknown';
    }
  }

  async getPhishingAttempts(userId: string) {
    try {
      this.logger.log(`Fetching phishing attempts for user: ${userId}`);
      if (!userId) {
        throw new BadRequestException('User ID is required');
      }
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
