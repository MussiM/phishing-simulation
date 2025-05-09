import { Injectable, ConflictException, NotFoundException, Logger, InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private usersRepository: UsersRepository) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const { email, password, name } = createUserDto;
      this.logger.log(`Creating new user with email: ${email}`);

      const existingUser = await this.usersRepository.findByEmail(email);

      if (existingUser) {
        this.logger.warn(`User creation failed: Email already in use - ${email}`);
        throw new ConflictException('Email already in use');
      }

      try {
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const user = await this.usersRepository.create({
          email,
          password: hashedPassword,
          name,
        });

        this.logger.log(`User created successfully: ${email}`);
        const { password: _, ...result } = user;
        return result;
      } catch (error) {
        this.logger.error(`Failed to hash password: ${error.message}`, error.stack);
        throw new InternalServerErrorException('Failed to create user');
      }
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      this.logger.error(`User creation error: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  async findById(id: string) {
    try {
      this.logger.log(`Finding user by ID: ${id}`);
      const user = await this.usersRepository.findById(id);

      if (!user) {
        this.logger.warn(`User not found with ID: ${id}`);
        throw new NotFoundException('User not found');
      }

      this.logger.log(`User found: ${id}`);
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error finding user by ID ${id}: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to find user');
    }
  }

  async findByEmail(email: string) {
    try {
      this.logger.log(`Finding user by email: ${email}`);
      return await this.usersRepository.findByEmail(email);
    } catch (error) {
      this.logger.error(`Error finding user by email ${email}: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to find user by email');
    }
  }
} 