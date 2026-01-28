const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 9000;

// 导入路由
const apiRoutes = require('./routes/api');

// 中间件
app.use(cors({
  // origin: 'http://www.julia-continuing.cn',
  origin: '*',
  credentials: true
}));
app.use(express.json()); // 解析JSON请求体
app.use(express.urlencoded({ extended: true })); // 解析URL编码请求体

// 基础路由
app.get('/', (req, res) => {
  res.json({ 
    message: 'API 服务运行正常',
    endpoints: {
      api: '/api/v1',
      users: '/api/v1/users',
      health: '/health'
    }
  });
});

// 健康检查端点
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 注册API路由
app.use('/', apiRoutes);

// 404处理
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: '请求的接口不存在',
  });
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: '服务器内部错误',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`🚀 服务器运行在 http://localhost:${PORT}`);
  console.log(`📚 API文档:`);
  console.log(`   GET  /api/v1/users        - 获取用户列表`);
  console.log(`   GET  /api/v1/users/:id    - 获取单个用户`);
  console.log(`   POST /api/v1/users        - 创建新用户`);
  console.log(`   PUT  /api/v1/users/:id    - 更新用户`);
  console.log(`   DELETE /api/v1/users/:id  - 删除用户`);
});