class ApiResponse {
  constructor(statusCode, message, result = null) {
    this.success = statusCode < 400;
    this.statusCode = statusCode;
    this.message = message;
    this.result = result;
  }
}

module.exports = ApiResponse;
