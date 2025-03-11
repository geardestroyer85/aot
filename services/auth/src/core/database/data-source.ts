import { DataSource, DataSourceOptions } from 'typeorm';
import { env } from 'shared'

export const dataSourceOptions = {
  type: 'postgres',
  url: env.DATABASE_URL,
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/**/migrations/*{.ts,.js}'],
  autoLoadEntities: true,
  synchronize: false,
  logging: true,
}

export default dataSourceOptions;
export const connectionSource = new DataSource(
  dataSourceOptions as DataSourceOptions,
)