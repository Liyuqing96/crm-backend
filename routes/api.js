const express = require('express');
const router = express.Router();

const userRoutes = require('./users');

// API版本前缀
const API_PREFIX = '/api/v1';

// 用户路由
router.use(`${API_PREFIX}/users`, userRoutes);

// 示例：其他业务路由
router.get(`${API_PREFIX}/products`, (req, res) => {
  res.json({
    success: true,
    data: [
      { id: 1, name: '产品A', price: 100 },
      { id: 2, name: '产品B', price: 200 }
    ]
  });
});

module.exports = router;