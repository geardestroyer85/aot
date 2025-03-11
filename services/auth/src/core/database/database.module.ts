import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { env } from 'shared';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: env.DATABASE_URL,
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: false,
      logging: false,
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
