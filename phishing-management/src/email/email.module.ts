import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { AuthModule } from '../auth/auth.module';
import { EmailRepository } from './email.repository';
import { PrismaService } from '../common/prisma/prisma.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [AuthModule, UsersModule],
  providers: [EmailService, EmailRepository, PrismaService],
  controllers: [EmailController],
  exports: [EmailService],
})

export class EmailModule {}
