import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendEmailDto {
  @ApiProperty({
    example: 'recipient1@example.com',
    description: 'Recipient',
  })
  @IsEmail()
  @IsNotEmpty()
  recipient: string;
}
