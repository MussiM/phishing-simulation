import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { AuthModule } from '../auth/auth.module';
import { EmailRepository } from './email.repository';
import { PrismaService } from '../common/prisma/prisma.service';

@Module({
  imports: [AuthModule],
  providers: [EmailService, EmailRepository, PrismaService],
  controllers: [EmailController],
  exports: [EmailService],
})

export class EmailModule {}
