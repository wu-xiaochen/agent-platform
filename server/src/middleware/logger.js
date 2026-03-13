/**
 * Request Logger Middleware
 */

function requestLogger(req, res, next) {
  const start = Date.now();
  
  // 响应完成后记录
  res.on('finish', () => {
    const duration = Date.now() - start;
    const log = {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString()
    };
    
    // 根据状态码选择日志颜色
    if (res.statusCode >= 500) {
      console.error('❌', log);
    } else if (res.statusCode >= 400) {
      console.warn('⚠️', log);
    } else {
      console.log('✅', log);
    }
  });
  
  next();
}

module.exports = { requestLogger };
