import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { LoginData } from 'shared';


export class LoginDto implements LoginData {
  @ApiProperty({
    description: 'The name or the email registered',
    example: 'username',
  })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({
    description: 'The password registered',
    example: 'password',
  })
  @IsString()
  password: string;
}