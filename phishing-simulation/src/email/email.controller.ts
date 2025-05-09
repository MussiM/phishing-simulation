import { Controller, Get, Post, Body, Param, Request, Logger, InternalServerErrorException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { EmailService } from './email.service';
import { SendEmailDto } from './dto/send-email.dto';

@ApiTags('emails')
@Controller('/phishing')
export class EmailController {
  private readonly logger = new Logger(EmailController.name);

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
    try {
      this.logger.log(`Sending email to: ${sendEmailDto.recipient}, subject: ${sendEmailDto.subject}`);
      return await this.emailService.sendEmail(sendEmailDto);
    } catch (error) {
      this.logger.error(`Failed to send email: ${error.message}`, error.stack);
      throw error;
    }
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
    try {
      this.logger.log(`Updating email status to 'clicked' for ID: ${emailId}`);
      if (!emailId) {
        this.logger.warn('Attempted to update status with null or empty emailId');
        throw new InternalServerErrorException('Email ID is required');
      }
      return await this.emailService.updateEmailStatus(emailId, 'clicked');
    } catch (error) {
      this.logger.error(`Failed to update email status: ${error.message}`, error.stack);
      throw error;
    }
  }
}
