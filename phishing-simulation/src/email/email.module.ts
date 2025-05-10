import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { EmailRepository } from './email.repository';
import { Email } from '../common/database/entities/email.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Email])
  ],
  providers: [EmailService, EmailRepository],
  controllers: [EmailController],
  exports: [EmailService],
})
export class EmailModule {}
