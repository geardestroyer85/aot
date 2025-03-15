import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpCode,
  Req,
} from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Profile } from './entities/profile.entity';
import { ProfilesService } from './profile.service';
import { User } from '../auth/auth.guard';
import { TokenPayload } from '../auth/auth.type';

@ApiTags('profiles')
@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @User()
  @Get()
  @ApiOperation({ summary: 'Get all profiles' })
  @ApiResponse({
    status: 200,
    description: 'List of profiles',
    type: [Profile],
  })
  async getAllProfiles(@Req() request: { user: TokenPayload }): Promise<Profile[]> {
    const userId = request.user.sub;
    return this.profilesService.getAllProfiles(userId);
  }

  @User()
  @Get(':id')
  @ApiOperation({ summary: 'Get a profile by ID' })
  @ApiResponse({ status: 200, description: 'The profile', type: Profile })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  async getProfile(@Req() request: { user: TokenPayload }, @Param('id') id: string): Promise<Profile> {
    const userId = request.user.sub;
    return this.profilesService.getProfileById(userId, id);
  }

  @User()
  @Post()
  @ApiOperation({ summary: 'Create a new profile' })
  @ApiResponse({ status: 201, description: 'Profile created', type: Profile })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async createProfile(
    @Req() request: { user: TokenPayload },
    @Body() createProfileDto: CreateProfileDto,
  ): Promise<Profile> {
    const userId = request.user.sub;
    return this.profilesService.createProfile(userId, createProfileDto);
  }

  @User()
  @Put(':id')
  @ApiOperation({ summary: 'Update a profile by ID' })
  @ApiResponse({ status: 200, description: 'Profile updated', type: Profile })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  async updateProfile(
    @Req() request: { user: TokenPayload },
    @Param('id') id: string,
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<Profile> {
    const userId = request.user.sub;
    return this.profilesService.updateProfile(userId, id, updateProfileDto);
  }

  @User()
  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete a profile by ID' })
  @ApiResponse({ status: 204, description: 'Profile deleted' })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  async deleteProfile(
    @Req() request: { user: TokenPayload },
    @Param('id') id: string
  ): Promise<void> {
    const userId = request.user.sub;
    return this.profilesService.deleteProfile(userId, id);
  }
}
