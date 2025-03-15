import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { UserRole } from 'shared';

export class RegisterByAdminDto {
  @ApiProperty({
    description: 'The unique name',
    example: 'username',
  })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({
    description: 'sample@email.com',
    example: 'email',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;


  @ApiProperty({
    description: 'The password',
    example: 'password',
  })
  @IsString()
  password: string;

  @ApiProperty({
    description: 'User role',
    example: 'user',
    required: false
  })
  @IsString()
  role?: UserRole;
  
}