import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { SendEmailDto } from './dto/send-email.dto';
import { EmailRepository } from './email.repository';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(
    private configService: ConfigService,
    private emailRepository: EmailRepository,
  ) {
    this.initializeTransporter();
  }

  private initializeTransporter() {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('SMTP_HOST'),
      port: this.configService.get<number>('SMTP_PORT'),
      secure: this.configService.get<boolean>('SMTP_SECURE', false),
      auth: {
        user: this.configService.get<string>('SMTP_USER'),
        pass: this.configService.get<string>('SMTP_PASSWORD'),
      },
    });
  }

  async sendEmail(userEmail: string, emailDto: SendEmailDto) {
    const { subject, content, recipient, emailId } = emailDto;
    try {
      const phishingUrl = `${this.configService.get<string>('PHISHING_URL')}/?emailId=${emailId}`;
      const fullContent = `
        ${content}
        Click here to view the email: ${phishingUrl}
      `;

      const mailOptions = {
        from: userEmail,
        to: recipient,
        subject,
        html: fullContent,
      };

      const result = await this.transporter.sendMail(mailOptions);

      await this.updateEmailStatus(emailId, 'sent');

      return {
        id: emailId,
        messageId: result.messageId,
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
