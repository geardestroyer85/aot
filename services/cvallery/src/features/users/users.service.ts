import { BadRequestException, HttpException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UserRole } from 'shared';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findOneByNameOrEmail(name: string) {
    if (!name) {
      throw new BadRequestException('Invalid name or email format');
    }
    try {
      const user = await this.userRepository.findOne({
        where: [{ name: name }, { email: name }],
      });
      if (!user) {
        throw new NotFoundException(
          `User with name or email ${name} not found`,
        );
      }
      return user;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      if (error instanceof Error) {
        throw new Error(
          `Failed to find user with name or email ${name}: ${error.message}`,
        );
      }
      throw new Error(
        `Failed to find user with name or email ${name}: Unknown error`,
      );
    }
  }

  async create(data: { name: string; email: string; password: string; role: UserRole }) {
    try {
      const user = this.userRepository.create(data);
      return await this.userRepository.save(user);
    } catch (error) {
      if (error?.['code'] === '23505' || error?.['code'] === 'ER_DUP_ENTRY') {
        throw new BadRequestException('User with this email or name already exists');
      }
      if (error instanceof Error) {
        throw new InternalServerErrorException(
          `Internal Server Error: ${error.message}`
        );
      }
      throw new InternalServerErrorException('Internal Server Error');
    }
  }}