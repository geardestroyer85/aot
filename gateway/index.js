require('dotenv').config();
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 3000;

// Proxy for the home app
app.use('/home', createProxyMiddleware({
  target: `http://localhost:${process.env.HOME_SERVICE_PORT || 4001}`,
  changeOrigin: true,
}));

// Proxy for the gosipo app
app.use('/gosipo', createProxyMiddleware({
  target: `http://localhost:${process.env.GOSIPO_SERVICE_PORT || 4002}`,
  changeOrigin: true,
}));

// Proxy for the cvallery app
app.use('/cvallery', createProxyMiddleware({
  target: `http://localhost:${process.env.CVALLERY_SERVICE_PORT || 4003}`,
  changeOrigin: true,
}));

// Proxy for the auth service
app.use('/api/auth', createProxyMiddleware({
  target: `http://localhost:${process.env.AUTH_SERVICE_PORT || 5001}`,
  changeOrigin: true,
}));

// Proxy for the cvallery service (backend)
app.use('/api/cvallery', createProxyMiddleware({
  target: `http://localhost:${process.env.CVALLERY_BACKEND_PORT || 6001}`,
  changeOrigin: true,
}));

// Proxy for the gosipo service (backend)
app.use('/api/gosipo', createProxyMiddleware({
  target: `http://localhost:${process.env.GOSIPO_BACKEND_PORT || 6002}`,
  changeOrigin: true,
}));

app.listen(PORT, () => {
  console.log(`Gateway is running on port ${PORT}`);
});
