import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SendEmailDto } from './dto/send-email.dto';
import { EmailRepository } from './email.repository';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  client: nodemailer.Transporter;

  constructor(
    private configService: ConfigService,
    private emailRepository: EmailRepository,
  ) {
  }

  async onModuleInit() {
    try {
      this.logger.log('Initializing SMTP client...');
      
      const user = process.env.SMTP_USER;
      const pass = process.env.SMTP_PASS;
      const host = process.env.SMTP_HOST;
      const port = parseInt(process.env.SMTP_PORT);
      
      if (!user || !pass || !host || isNaN(port)) {
        throw new Error('Missing SMTP configuration');
      }
      
      this.client = nodemailer.createTransport({
        host,
        port,
        auth: {
          user,
          pass
        }
      });
      
      this.logger.log('SMTP client initialized successfully');
    } catch (error) {
      this.logger.error(`Error initializing SMTP client: ${error.message}`, error.stack);
    }
  }

  async sendEmail(emailDto: SendEmailDto) {
    const { subject, content, recipient, emailId } = emailDto;
    
    if (!this.client) {
      this.logger.error('SMTP client not initialized');
      throw new InternalServerErrorException('Email service not available');
    }
    
    try {
      this.logger.log(`Sending email to ${recipient} with subject "${subject}"`);
      
      const phishingUrl = `${this.configService.get<string>('PHISHING_URL')}?emailId=${emailId}`;
      
      const fullContent = `
        ${content}
        Click here to view the email: ${phishingUrl}
      `;

      await this.client.sendMail({
        from: this.configService.get<string>('PHISHING_SENDER_EMAIL'),
        to: recipient,
        subject,
        text: fullContent,

      });

      this.logger.log(`Email sent successfully to ${recipient}`);
      await this.updateEmailStatus(emailId, 'sent');

      return {
        id: emailId,
        deliveryStatus: 'sent',
      };
    } catch (error) {
      this.logger.error(`Failed to send email to ${recipient}: ${error.message}`, error.stack);
      await this.updateEmailStatus(emailId, 'failed');
      throw new InternalServerErrorException(
        `Failed to send email: ${error.message}`,
      );
    }
  }

  async getEmailById(id: string) {
    try {
      this.logger.log(`Getting email by ID: ${id}`);
      if (!id) {
        this.logger.warn('Attempted to get email with null or empty ID');
        throw new Error('Email ID is required');
      }
      
      return await this.emailRepository.findEmailById(id);
    } catch (error) {
      this.logger.error(`Error retrieving email with ID ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async updateEmailStatus(emailId: string, status: string) {
    try {
      this.logger.log(`Updating email status: ID=${emailId}, status=${status}`);
      
      if (!emailId) {
        this.logger.warn('Attempted to update status with null or empty emailId');
        throw new Error('Email ID is required');
      }

      await this.emailRepository.updateEmailStatus(emailId, status);
      
      this.logger.log(`Email status updated: ID=${emailId}, new status=${status}`);
      return {
        success: true,
        message: `Email status updated as ${status}`,
        emailId
      };
    } catch (error) {
      this.logger.error(`Failed to update email status for ID ${emailId}: ${error.message}`, error.stack);
      throw new InternalServerErrorException(
        `Failed to update email status: ${error.message}`,
      );
    }
  }
}
