const express = require('express');
const router = express.Router();
const deepseekService = require('../services/deepseek.service');

/**
 * POST /api/v1/chat
 * 聊天接口 - 接收前端消息并调用 DeepSeek API
 *
 * 请求体示例:
 * {
 *   "message": "你好，请介绍一下你自己",
 *   "history": [
 *     { "role": "user", "content": "之前的消息" },
 *     { "role": "assistant", "content": "之前的回复" }
 *   ],
 *   "options": {
 *     "model": "deepseek-chat",
 *     "temperature": 0.7,
 *     "max_tokens": 2000
 *   }
 * }
 */
router.post('/', async (req, res) => {
  try {
    const { message, history = [], options = {} } = req.body;

    // 验证必填参数
    if (!message || typeof message !== 'string' || message.trim() === '') {
      return res.status(400).json({
        success: false,
        message: '请提供有效的消息内容',
        error: 'message 参数是必填的，且不能为空'
      });
    }

    // 调用 DeepSeek API
    const result = await deepseekService.chat(message.trim(), history, options);

    // 如果调用失败，返回错误信息
    if (!result.success) {
      return res.status(500).json({
        code: 1001,
        success: false,
        message: 'AI 服务调用失败',
        error: result.error
      });
    }

    // 返回成功结果
    res.json({
      code: 0,
      success: true,
      data: {
        reply: result.data.message,
        model: result.data.model,
        usage: result.data.usage
      },
      message: '消息发送成功'
    });

  } catch (error) {
    console.error('Chat 路由错误:', error);
    res.status(500).json({
      code: 1002,
      success: false,
      message: '服务器内部错误',
      error: process.env.NODE_ENV === 'development' ? error.message : '请稍后重试'
    });
  }
});

/**
 * GET /api/v1/chat/health
 * 健康检查接口
 */
router.get('/health', (req, res) => {
  const hasApiKey = process.env.DEEPSEEK_API_KEY

  res.json({
    success: true,
    data: {
      status: 'ok',
      apiConfigured: hasApiKey,
      message: hasApiKey ? 'DeepSeek API 已配置' : 'DeepSeek API 未配置，请设置环境变量'
    }
  });
});

module.exports = router;