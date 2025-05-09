import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SendEmailDto } from './dto/send-email.dto';
import { EmailRepository } from './email.repository';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  client;

  constructor(
    private configService: ConfigService,
    private emailRepository: EmailRepository,
  ) {
  }

  async onModuleInit() {
    try {
      this.client = new (await import("emailjs")).SMTPClient({
        user: process.env.SMTP_USER,
        password: process.env.SMTP_PASS,
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT)
      });
    } catch (e) {
      this.logger.error('error in init client SMTP')
    }
  }

  async sendEmail(userEmail: string, emailDto: SendEmailDto) {
    const { subject, content, recipient, emailId } = emailDto;
    try {
      const phishingUrl = `${this.configService.get<string>('PHISHING_URL')}/?emailId=${emailId}`;
      const fullContent = `
        ${content}
        Click here to view the email: ${phishingUrl}
      `;

      await this.client.sendAsync({
        text: fullContent,
        from: userEmail,
        to: recipient,
        subject: subject,
      });

      await this.updateEmailStatus(emailId, 'sent');

      return {
        id: emailId,
        deliveryStatus: 'sent',
      };
    } catch (error) {
      await this.updateEmailStatus(emailId, 'failed');
      throw new InternalServerErrorException(
        `Failed to send email: ${error.message}`,
      );
    }
  }

  async getEmailById(id: string) {
    return this.emailRepository.findEmailById(id);
  }

  async updateEmailStatus(emailId: string, status: string) {
    try {
      
      if (!emailId) {
        throw new Error('Email not found');
      }

      await this.emailRepository.updateEmailStatus(emailId, status);
      
      return {
        success: true,
        message: `Email status updated as ${status}`,
        emailId
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to update email status: ${error.message}`,
      );
    }
  }
}
