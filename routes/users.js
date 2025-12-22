const express = require('express');
const router = express.Router();

// 模拟用户数据
let users = [
  { id: 1, name: '张三', email: 'zhangsan@example.com' },
  { id: 2, name: '李四', email: 'lisi@example.com' },
  { id: 3, name: '王五', email: 'wangwu@example.com' }
];

// 获取所有用户
router.get('/', (req, res) => {
  res.json({
    success: true,
    data: users,
    message: '用户列表获取成功'
  });
});

// 获取单个用户
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const user = users.find(u => u.id === id);
  
  if (!user) {
    return res.status(404).json({
      success: false,
      message: '用户不存在'
    });
  }
  
  res.json({
    success: true,
    data: user
  });
});

// 创建新用户
router.post('/', (req, res) => {
  const { name, email } = req.body;
  
  if (!name || !email) {
    return res.status(400).json({
      success: false,
      message: '请提供姓名和邮箱'
    });
  }
  
  const newUser = {
    id: users.length + 1,
    name,
    email,
    createdAt: new Date().toISOString()
  };
  
  users.push(newUser);
  
  res.status(201).json({
    success: true,
    data: newUser,
    message: '用户创建成功'
  });
});

// 更新用户
router.put('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { name, email } = req.body;
  
  const userIndex = users.findIndex(u => u.id === id);
  
  if (userIndex === -1) {
    return res.status(404).json({
      success: false,
      message: '用户不存在'
    });
  }
  
  users[userIndex] = {
    ...users[userIndex],
    name: name || users[userIndex].name,
    email: email || users[userIndex].email,
    updatedAt: new Date().toISOString()
  };
  
  res.json({
    success: true,
    data: users[userIndex],
    message: '用户更新成功'
  });
});

// 删除用户
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const userIndex = users.findIndex(u => u.id === id);
  
  if (userIndex === -1) {
    return res.status(404).json({
      success: false,
      message: '用户不存在'
    });
  }
  
  const deletedUser = users.splice(userIndex, 1)[0];
  
  res.json({
    success: true,
    data: deletedUser,
    message: '用户删除成功'
  });
});

module.exports = router;