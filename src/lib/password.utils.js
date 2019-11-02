import bcrypt from 'bcryptjs';

module.exports = {
  validatePassword: (password) => {
    return bcrypt.compare(password, this.password);
  },
  hashPassword: (password) => {
    return bcrypt.hash(password, 10);
  }
}