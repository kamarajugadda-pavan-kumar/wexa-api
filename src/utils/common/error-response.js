function error() {
  return {
    success: false,
    message: "Failed to completed the request",
    data: {},
    error: {},
  };
}

module.exports = error;
