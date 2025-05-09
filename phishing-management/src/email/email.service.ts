import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EmailRepository } from './email.repository';

@Injectable()
export class EmailService {

  constructor(
    private configService: ConfigService,
    private emailRepository: EmailRepository,
  ) {
  }

  async sendEmail() {
    
  }

  async getPhishingAttempts(userId: string) {
    return this.emailRepository.findEmailsForUser(userId);
  }

  async getPhishingAttemptById(id: string) {
    return this.emailRepository.findEmailById(id);
  }
}
