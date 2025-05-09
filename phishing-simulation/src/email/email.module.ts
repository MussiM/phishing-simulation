import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { EmailRepository } from './email.repository';
import { PrismaService } from '../common/prisma/prisma.service';

@Module({
  imports: [],
  providers: [EmailService, EmailRepository, PrismaService],
  controllers: [EmailController],
  exports: [EmailService],
})

export class EmailModule {}
