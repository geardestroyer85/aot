import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from './entities/profile.entity';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
  ) {}

  async getAllProfiles(userId: string): Promise<Profile[]> {
    return this.profileRepository.find({
      where: { userId }
    });
  }

  async getProfileById(userId: string, id: string): Promise<Profile> {
    const profile = await this.profileRepository.findOne({
      where: { id, userId }
    });
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }
    return profile;
  }

  async createProfile(userId: string, createProfileDto: CreateProfileDto): Promise<Profile> {
    const profile = this.profileRepository.create({ userId, ...createProfileDto });
    return this.profileRepository.save(profile);
  }

  async updateProfile(
    userId: string,
    id: string,
    updateProfileDto: UpdateProfileDto,
  ): Promise<Profile> {
    const profile = await this.getProfileById(userId, id);
    Object.assign(profile, updateProfileDto);
    return this.profileRepository.save(profile);
  }

  async deleteProfile(userId: string, id: string): Promise<void> {
    const result = await this.profileRepository.delete({ id, userId });
    if (result.affected === 0) {
      throw new NotFoundException('Profile not found');
    }
  }}
