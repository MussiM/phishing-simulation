import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { EmailService } from './email.service';
import { SendEmailDto } from './dto/send-email.dto';
import { AuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Phishing Attempt')
@Controller('/phishing-attempt')
@ApiBearerAuth()
export class EmailController {
  constructor(private emailService: EmailService) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Send an email' })
  @ApiResponse({
    status: 201,
    description: 'Email successfully sent',
  })
  @ApiResponse({
    status: 500,
    description: 'Failed to send email',
  })
  async sendEmail(@Request() req, @Body() sendEmailDto: SendEmailDto) {
    const userId = req.user.id || req.user.sub;
    
    return this.emailService.sendEmail(sendEmailDto, userId);
  }

  @Get()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get all emails for the current user' })
  @ApiResponse({
    status: 200,
    description: 'Return all emails for the current user',
  })
  async getEmails(@Request() req) {
    const userId = req.user.id || req.user.sub;
    return this.emailService.getPhishingAttempts(userId);
  }
}
