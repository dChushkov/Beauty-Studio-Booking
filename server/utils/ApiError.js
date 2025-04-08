/**
 * Custom error class for API errors with status code support
 * This allows for consistent error handling across the application
 */
class ApiError extends Error {
  constructor(message, statusCode, errors = null) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.success = false;
    
    // Capture stack trace, excluding constructor call from it
    Error.captureStackTrace(this, this.constructor);
  }
  
  /**
   * Create a BadRequest error (400)
   * @param {string} message - Error message
   * @param {object} errors - Validation errors
   * @returns {ApiError} - ApiError instance
   */
  static badRequest(message = 'Bad Request', errors = null) {
    return new ApiError(message, 400, errors);
  }
  
  /**
   * Create an Unauthorized error (401)
   * @param {string} message - Error message
   * @returns {ApiError} - ApiError instance
   */
  static unauthorized(message = 'Unauthorized access') {
    return new ApiError(message, 401);
  }
  
  /**
   * Create a Forbidden error (403)
   * @param {string} message - Error message
   * @returns {ApiError} - ApiError instance
   */
  static forbidden(message = 'Forbidden') {
    return new ApiError(message, 403);
  }
  
  /**
   * Create a NotFound error (404)
   * @param {string} message - Error message
   * @returns {ApiError} - ApiError instance
   */
  static notFound(message = 'Resource not found') {
    return new ApiError(message, 404);
  }
  
  /**
   * Create a Conflict error (409)
   * @param {string} message - Error message
   * @returns {ApiError} - ApiError instance
   */
  static conflict(message = 'Conflict') {
    return new ApiError(message, 409);
  }
  
  /**
   * Create an Internal Server Error (500)
   * @param {string} message - Error message
   * @returns {ApiError} - ApiError instance
   */
  static internal(message = 'Internal Server Error') {
    return new ApiError(message, 500);
  }
}

module.exports = ApiError; 