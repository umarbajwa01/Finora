// Wraps async route handlers so we don't repeat try/catch everywhere.
// Any thrown/rejected error is forwarded to the centralized error handler.
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
