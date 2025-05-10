import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendEmailDto {
  @ApiProperty({
    example: '668d6b8d6b8d6b8d6b8d6b8d',
    description: 'Email id',
  })
  @IsString()
  @IsNotEmpty()
  emailId: string;

  @ApiProperty({
    example: 'recipient1@example.com',
    description: 'Email of recipient',
  })
  @IsEmail()
  @IsNotEmpty()
  recipient: string;
}
