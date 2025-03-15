import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { Public, User } from './auth.guard';
import { RegisterDto } from './dto/register.dto';
import { RegisterByAdminDto } from './dto/register-by-admin.dto';
import { auth } from 'shared';
import { TokenPayload } from './auth.type';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Sign in Platform' })
  @ApiResponse({ status: 200, description: 'Successfully signed in', schema: { properties: { access_token: { type: 'string' } } } })
  @ApiResponse({ status: 401, description: 'Wrong password or unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async login(@Body() dto: LoginDto): Promise<auth.LoginRes> {
    if (!dto.username || !dto.password) {
      throw new Error('Username and password are required');
    }
    const username = dto.username.trim();
    const password = dto.password;
    const result = await this.authService.login(username, password);
    return result;
  }

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register Platform' })
  @ApiResponse({ status: 201, description: 'Successfully registered' })
  @ApiResponse({ status: 400, description: 'Bad request or user already exists' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async register(@Body() dto: RegisterDto): Promise<auth.RegisterRes> {
    if (!dto.username || !dto.email || !dto.password) {
      throw new Error('Username, email and password are required');
    }
    const username = dto.username.trim();
    const email = dto.email.trim().toLowerCase();
    const password = dto.password;
    const result = await this.authService.register(
      username,
      email,
      password
    );
    return result;
  }

  @Post('register-by-admin')
  @ApiOperation({ summary: 'Register user by admin' })
  @ApiResponse({ status: 201, description: 'Successfully registered user' })
  @ApiResponse({ status: 400, description: 'Bad request or user already exists' })
  @ApiResponse({ status: 401, description: 'Unauthorized - No access token' })
  @ApiResponse({ status: 403, description: 'Forbidden - Not enough permissions' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async registerByAdmin(@Body() dto: RegisterByAdminDto): Promise<auth.RegisterRes> {
    if (!dto.username || !dto.email || !dto.password) {
      throw new Error('Username, email and password are required');
    }
    const username = dto.username.trim();
    const email = dto.email.trim().toLowerCase();
    const password = dto.password;
    const result = await this.authService.registerByAdmin(
      username,
      email,
      password,
      dto.role
    );
    return result;
  }

  @User()
  @Get('me')
  @ApiOperation({ summary: 'Get user information from token' })
  @ApiResponse({ status: 200, description: 'User information retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized - No access token' })
  @ApiResponse({ status: 403, description: 'Forbidden - Not enough permissions' })
  async getMe(@Req() request: { user: TokenPayload }): Promise<auth.UserInfo> {
    const userId = request.user.sub;
    return await this.authService.getUserInfo(userId);
  }
}