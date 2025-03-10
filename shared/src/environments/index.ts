import * as dotenv from 'dotenv'

dotenv.config();

export const HOST: string = process.env.HOST ?? '127.0.0.1'

export const PORT: number = +(process.env.PORT ?? 1202);
export const HOME_APP_PORT: number = +(process.env.HOME_APP_PORT ?? 4001)
export const GOSIPO_APP_PORT: number = +(process.env.GOSIPO_APP_PORT ?? 4002)
export const CVALLERY_APP_PORT: number = +(process.env.CVALLERY_APP_PORT ?? 4003)
export const AUTH_SERVICE_PORT: number = +(process.env.AUTH_SERVICE_PORT ?? 5001)
export const GOSIPO_SERVICE_PORT: number = +(process.env.GOSIPO_SERVICE_PORT ?? 5002)
export const CVALLERY_SERVICE_PORT: number = +(process.env.CVALLERY_SERVICE_PORT ?? 5003)
