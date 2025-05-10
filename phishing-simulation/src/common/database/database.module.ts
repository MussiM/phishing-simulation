import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Email } from './entities/email.entity';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mongodb',
        url: configService.get('DATABASE_URL'),
        entities: [Email],
        synchronize: true,
        useUnifiedTopology: true,
      }),
    }),
    TypeOrmModule.forFeature([Email]),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {} 