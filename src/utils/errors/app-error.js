class AppError extends Error {
  constructor(
    explanation,
    statusCode,
    stackTrace = "Empty stack trace",
    details = []
  ) {
    super(explanation);
    this.statusCode = statusCode;
    this.explanation = explanation;
    this.stackTrace = stackTrace;
    this.details = details;
  }
}

module.exports = AppError;
