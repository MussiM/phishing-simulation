import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { EmailService } from './email.service';
import { SendEmailDto } from './dto/send-email.dto';
import { AuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Phishing Attempt')
@Controller('/phishing')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class EmailController {
  constructor(private emailService: EmailService) {}

  @Post()
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
    return this.emailService.sendEmail(req.user.id, sendEmailDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all emails for the current user' })
  @ApiResponse({
    status: 200,
    description: 'Return all emails for the current user',
  })
  async getEmails(@Request() req) {
    return this.emailService.getEmailsForUser(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an email by ID' })
  @ApiResponse({
    status: 200,
    description: 'Return the email',
  })
  @ApiResponse({
    status: 404,
    description: 'Email not found',
  })
  async getEmailById(@Param('id') id: string) {
    return this.emailService.getEmailById(id);
  }
}
