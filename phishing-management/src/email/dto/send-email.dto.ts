import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendEmailDto {
  @ApiProperty({ example: 'Important Announcement', description: 'Email subject' })
  @IsString()
  @IsNotEmpty()
  subject: string;

  @ApiProperty({ example: 'This is the content of the email.', description: 'Email content' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    example: 'recipient1@example.com',
    description: 'Recipient',
  })
  @IsEmail()
  @IsNotEmpty()
  recipient: string;
}
