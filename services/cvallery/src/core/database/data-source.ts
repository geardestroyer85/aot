import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';

const configService = new ConfigService();

export const dataSourceOptions = {
  type: 'postgres',
  url: configService.get<string>('DATABASE_URL'),
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/**/migrations/*{.ts,.js}'],
  autoLoadEntities: true,
  synchronize: false, // Disable sync; use migrations instead
  logging: true, // Enable for debugging
}

export default dataSourceOptions;
export const connectionSource = new DataSource(
  dataSourceOptions as DataSourceOptions,
)