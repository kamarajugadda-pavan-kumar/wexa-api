// write funcitons to encript and compare the passwords
const bcrypt = require("bcrypt");
const saltRounds = 10;

const encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(saltRounds);
  const hash = await bcrypt.hash(password, salt);
  return hash;
};

const comparePassword = async (plainTextPassword, hashedPassword) => {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};

module.exports = {
  encryptPassword,
  comparePassword,
};
