import { Injectable, UnauthorizedException, Logger, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    try {
      this.logger.log(`Validating user: ${email}`);
      const user = await this.usersService.findByEmail(email);
      
      if (user && await bcrypt.compare(password, user.password)) {
        this.logger.log(`User validation successful: ${email}`);
        const { password, ...result } = user;
        return result;
      }
      
      this.logger.warn(`Invalid login attempt for user: ${email}`);
      return null;
    } catch (error) {
      this.logger.error(`Error validating user ${email}: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Authentication service error');
    }
  }

  async login(loginDto: LoginDto) {
    try {
      this.logger.log(`Login attempt for user: ${loginDto.email}`);
      const user = await this.validateUser(loginDto.email, loginDto.password);
      
      if (!user) {
        this.logger.warn(`Invalid credentials for user: ${loginDto.email}`);
        throw new UnauthorizedException('Invalid credentials');
      }
      
      const payload = { email: user.email, sub: user.id };
      const token = this.jwtService.sign(payload);
      
      this.logger.log(`Login successful for user: ${loginDto.email}`);
      return {
        access_token: token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      
      this.logger.error(`Login error for user ${loginDto.email}: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Authentication service error');
    }
  }
}
