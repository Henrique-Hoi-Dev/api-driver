const bcrypt = require('bcrypt');
const crypto = require('crypto');

const authenticatePassword = (plainTextPassword, encryptedPassword) =>
    bcrypt.compareSync(plainTextPassword, encryptedPassword);

const encryptPassword = (password) => bcrypt.hashSync(password, 10);

const generateRandomCode = (size = 3) => crypto.randomBytes(size).toString('hex').toUpperCase();

module.exports = { authenticatePassword, encryptPassword, generateRandomCode };
