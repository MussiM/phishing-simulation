import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
    Logger,
  } from '@nestjs/common';
  import { JwtService } from '@nestjs/jwt';
  import { Request } from 'express';
  import { ConfigService } from '@nestjs/config';
  
  @Injectable()
  export class AuthGuard implements CanActivate {
    private readonly logger = new Logger(AuthGuard.name);
    
    constructor(
      private jwtService: JwtService,
      private configService: ConfigService
    ) {}
  
    async canActivate(context: ExecutionContext): Promise<boolean> {
      try {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        
        if (!token) {
          this.logger.warn('Authentication failed: No token provided');
          throw new UnauthorizedException('Authentication token is missing');
        }
        
        try {
          const payload = await this.jwtService.verifyAsync(
            token,
            {
              secret: this.configService.get<string>('JWT_SECRET')
            }
          );
          request['user'] = payload;
          this.logger.debug(`User authenticated: ${payload.sub || payload.id || 'unknown'}`);
        } catch (error) {
          this.logger.error(`Token verification failed: ${error.message}`);
          throw new UnauthorizedException('Invalid authentication token');
        }
        
        return true;
      } catch (error) {
        if (error instanceof UnauthorizedException) {
          throw error;
        }
        this.logger.error(`Authentication error: ${error.message}`, error.stack);
        throw new UnauthorizedException('Authentication failed');
      }
    }
  
    private extractTokenFromHeader(request: Request): string | undefined {
      try {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
      } catch (error) {
        this.logger.error(`Error extracting token: ${error.message}`);
        return undefined;
      }
    }
  }
  