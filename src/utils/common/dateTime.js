function isValidISODate(dateString) {
  const date = new Date(dateString);
  return !isNaN(date.getTime()) && dateString === date.toISOString();
}

module.exports = {
  isValidISODate,
};
