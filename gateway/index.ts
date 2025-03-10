import express, { Request, Response } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { env } from 'shared';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use('/home', createProxyMiddleware({
  target: `http://${env.HOST}:${env.HOME_APP_PORT || 4001}/home`,
  changeOrigin: true,
}));

app.listen(env.PORT, env.HOST, () => {
  console.log(`Gateway is running on ${env.HOST}:${env.PORT}`);
  console.log(`Home Url:`, `http://${env.HOST}:${env.HOME_APP_PORT || 4001}/home`)
});