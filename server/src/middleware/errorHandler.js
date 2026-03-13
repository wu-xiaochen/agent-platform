/**
 * Error Handler Middleware
 */

function errorHandler(err, req, res, next) {
  console.error('❌ Error:', err.message);
  console.error('Stack:', err.stack);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';
  
  // 生产环境不暴露详细错误
  const response = {
    error: message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  };
  
  res.status(statusCode).json(response);
}

module.exports = { errorHandler };
