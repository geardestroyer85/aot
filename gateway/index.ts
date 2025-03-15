import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { env } from 'shared';

const app = express();

app.use('/home', createProxyMiddleware({
  target: `http://${env.HOST}:${env.HOME_APP_PORT}/home`,
  changeOrigin: true,
}));

app.use('/api/auth', createProxyMiddleware({
  target: `http://${env.HOST}:${env.AUTH_SERVICE_PORT}/api/auth`,
  changeOrigin: true,
}))

app.use('/gosipo', createProxyMiddleware({
  target: `http://${env.HOST}:${env.GOSIPO_APP_PORT}/gosipo`,
  changeOrigin: true,
}))

app.listen(env.PORT, env.HOST, () => {
  console.log(`Gateway is running on ${env.HOST}:${env.PORT}`);
});