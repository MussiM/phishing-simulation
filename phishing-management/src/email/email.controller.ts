import { Controller, Get, Post, Body, Param, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { EmailService } from './email.service';
import { SendEmailDto } from './dto/send-email.dto';

@ApiTags('emails')
@Controller('/phishing')
export class EmailController {
  constructor(private emailService: EmailService) {}

  @Post('/send')
  @ApiOperation({ summary: 'Send an email' })
  @ApiResponse({
    status: 200,
    description: 'Email successfully sent',
  })
  @ApiResponse({
    status: 500,
    description: 'Failed to send email',
  })
  async sendEmail(@Request() req, @Body() sendEmailDto: SendEmailDto) {
    return this.emailService.sendEmail(req.user.id, sendEmailDto);
  }

  @Post('/clicked/:emailId')
  @ApiOperation({ summary: 'Update the email status as clicked' })
  @ApiParam({ name: 'emailId', description: 'Email ID', example: '668d6b8d6b8d6b8d6b8d6b8d' })
  @ApiResponse({
    status: 200,
    description: 'Email status updated as clicked',
  })
  @ApiResponse({
    status: 500,
    description: 'Failed to update the email status as clicked',
  })
  async updateEmailStatus(@Request() req, @Param('emailId') emailId: string) {
    return this.emailService.updateEmailStatus(emailId);
  }
}
