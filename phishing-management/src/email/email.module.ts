import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { AuthModule } from '../auth/auth.module';
import { EmailRepository } from './email.repository';
import { UsersModule } from 'src/users/users.module';
import { Email } from '../common/database/entities/email.entity';
import { User } from '../common/database/entities/user.entity';

@Module({
  imports: [
    AuthModule, 
    UsersModule,
    TypeOrmModule.forFeature([Email, User])
  ],
  providers: [EmailService, EmailRepository],
  controllers: [EmailController],
  exports: [EmailService],
})
export class EmailModule {}
