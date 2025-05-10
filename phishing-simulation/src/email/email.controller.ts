import { Controller, Get, Post, Body, Param, Logger, InternalServerErrorException, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { EmailService } from './email.service';
import { SendEmailDto } from './dto/send-email.dto';
import { join } from 'path';
import { Response } from 'express';

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
  async sendEmail(@Body() sendEmailDto: SendEmailDto) {
    try {
      this.logger.log(`Sending email to: ${sendEmailDto.recipient}`);
      return await this.emailService.sendEmail(sendEmailDto);
    } catch (error) {
      this.logger.error(`Failed to send email: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Get('/landing-page/:emailId')
  @ApiOperation({ summary: 'Return HTML landing page' })
  @ApiResponse({
    status: 200,
    description: 'HTML page returned successfully',
  })
  @ApiResponse({
    status: 500,
    description: 'Failed to return HTML page',
  })
  async getHtmlPage(@Res() res: Response, @Param('emailId') emailId: string) {
    try {
      this.logger.log(`Serving HTML landing page for email ID: ${emailId}`);
      
      await this.emailService.updateEmailClicks(emailId);
      
      const filePath = join(process.cwd(), 'src/templates/landing-page.html');
      return res.sendFile(filePath);
    } catch (error) {
      this.logger.error(`Failed to serve HTML landing page: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to serve HTML landing page');
    }
  }
}
