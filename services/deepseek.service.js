const axios = require('axios');

class DeepSeekService {
  constructor() {
    this.apiKey = process.env.DEEPSEEK_API_KEY;
    this.apiUrl = process.env.DEEPSEEK_API_URL || 'https://api.deepseek.com/v1/chat/completions';

    if (!this.apiKey) {
      console.warn('警告: DEEPSEEK_API_KEY 未在环境变量中配置');
    }
  }

  /**
   * 调用 DeepSeek 聊天接口
   * @param {string} message - 用户的消息
   * @param {Array} history - 聊天历史记录 (可选)
   * @param {Object} options - 其他配置选项
   * @returns {Promise<Object>} - API 响应结果
   */
  async chat(message, history = [], options = {}) {
    try {
      // 验证 API Key
      if (!this.apiKey) {
        throw new Error('DeepSeek API Key 未配置，请在 .env 文件中设置 DEEPSEEK_API_KEY');
      }

      // 构建消息列表
      const messages = [
        ...history,
        {
          role: 'user',
          content: message
        }
      ];

      // 构建请求体
      const requestBody = {
        model: options.model || 'deepseek-chat',
        messages: messages,
        temperature: options.temperature || 0.7,
        max_tokens: options.max_tokens || 2000,
        ...options.extra
      };

      // 发送请求到 DeepSeek API
      const response = await axios.post(this.apiUrl, requestBody, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        timeout: options.timeout || 30000
      });

      // 返回格式化后的结果
      return {
        code: 0,
        success: true,
        data: {
          message: response.data.choices[0].message.content,
          model: response.data.model,
          usage: response.data.usage,
          raw: response.data
        }
      };

    } catch (error) {
      console.error('DeepSeek API 调用失败:', error.message);

      // 处理不同类型的错误
      if (error.response) {
        // API 返回了错误响应
        return {
          code: 1001,
          success: false,
          error: {
            message: error.response.data.error?.message || '调用 DeepSeek API 失败',
            status: error.response.status,
            details: error.response.data
          }
        };
      } else if (error.request) {
        // 请求已发送但没有收到响应
        return {
          code: 1002,
          success: false,
          error: {
            message: '无法连接到 DeepSeek API，请检查网络连接',
            details: error.message
          }
        };
      } else {
        // 其他错误
        return {
          code: 1003,
          success: false,
          error: {
            message: error.message || '未知错误',
            details: error.toString()
          }
        };
      }
    }
  }

  /**
   * 流式调用（如果需要支持流式响应）
   * @param {string} message - 用户的消息
   * @param {Array} history - 聊天历史记录
   * @param {Function} onChunk - 接收到数据块时的回调函数
   * @param {Object} options - 其他配置选项
   */
  async chatStream(message, history = [], onChunk, options = {}) {
    try {
      if (!this.apiKey) {
        throw new Error('DeepSeek API Key 未配置');
      }

      const messages = [
        ...history,
        { role: 'user', content: message }
      ];

      const requestBody = {
        model: options.model || 'deepseek-chat',
        messages: messages,
        temperature: options.temperature || 0.7,
        stream: true,
        ...options.extra
      };

      const response = await axios.post(this.apiUrl, requestBody, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        responseType: 'stream',
        timeout: options.timeout || 60000
      });

      return response.data;

    } catch (error) {
      console.error('DeepSeek Stream API 调用失败:', error.message);
      throw error;
    }
  }
}

module.exports = new DeepSeekService();
