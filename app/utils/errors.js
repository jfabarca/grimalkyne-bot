class AppError extends Error {
  constructor(message = '') {
    super(message);
    Error.captureStackTrace(this, this.constructor);
  }
}

class CommandValidationError extends AppError {
  constructor(message = '') {
    super(message);
  }
}

module.exports = {
  AppError,
  CommandValidationError
};
