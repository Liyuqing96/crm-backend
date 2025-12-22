const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/myapp', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log(`✅ MongoDB已连接: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`❌ 数据库连接失败: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;