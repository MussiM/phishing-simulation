import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { User } from '../common/database/entities/user.entity';

@Injectable()
export class UsersRepository {
  private readonly logger = new Logger(UsersRepository.name);

  constructor(
    @InjectRepository(User)
    private userRepository: MongoRepository<User>,
  ) {}

  async findByEmail(email: string) {
    try {
      this.logger.log(`Finding user by email: ${email}`);
      return await this.userRepository.findOne({ where: { email } });
    } catch (error) {
      this.logger.error(`Error finding user by email: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to find user by email');
    }
  }

  async create(data: { email: string; password: string; name: string }) {
    try {
      this.logger.log(`Creating new user with email: ${data.email}`);
      const user = this.userRepository.create(data);
      return await this.userRepository.save(user);
    } catch (error) {
      this.logger.error(`Error creating user: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  async findById(id: string) {
    try {
      this.logger.log(`Finding user by ID: ${id}`);
      return await this.userRepository.findOne({ where: { id } });
    } catch (error) {
      this.logger.error(`Error finding user by ID ${id}: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to find user by ID');
    }
  }
} 