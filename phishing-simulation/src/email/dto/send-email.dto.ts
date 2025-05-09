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
    example: 'sender@example.com',
    description: 'Email of sender',
  })
  @IsEmail()
  @IsNotEmpty()
  senderEmail: string;

  @ApiProperty({
    example: 'recipient1@example.com',
    description: 'Email of recipient',
  })
  @IsEmail()
  @IsNotEmpty()
  recipient: string;

  @ApiProperty({
    example: '668d6b8d6b8d6b8d6b8d6b8d',
    description: 'Email id',
  })
  @IsString()
  @IsNotEmpty()
  emailId: string;
}
