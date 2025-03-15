import dotenv from 'dotenv';
import { join } from 'path';

const envPath = join(__dirname, '..', '..', '..', '.env');
dotenv.config({ path: envPath });

dotenv.config();

export const env = {
  HOST: process.env.HOST ?? '127.0.0.1',
  PORT: Number(process.env.PORT ?? 1202),
  HOME_APP_PORT: Number(process.env.HOME_APP_PORT ?? 4001),
  GOSIPO_APP_PORT: Number(process.env.GOSIPO_APP_PORT ?? 4002),
  CVALLERY_APP_PORT: Number(process.env.CVALLERY_APP_PORT ?? 4003),
  AUTH_SERVICE_PORT: Number(process.env.AUTH_SERVICE_PORT ?? 5001),
  GOSIPO_SERVICE_PORT: Number(process.env.GOSIPO_SERVICE_PORT ?? 5002),
  CVALLERY_SERVICE_PORT: Number(process.env.CVALLERY_SERVICE_PORT ?? 5003),
  DATABASE_URL: process.env.DATABASE_URL ?? '',
  JWT_SECRET: process.env.JWT_SECRET ?? '',
  ENCRYPTION_KEY: process.env.ENCRYPTION_KEY ?? 'vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3',
} as const;
