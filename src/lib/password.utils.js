import bcrypt from 'bcryptjs';

module.exports = {
  validatePassword: (hashedPassword, plainTextPassword) => {
    console.log('--- Inside validatePassword ---')
    console.log('hashedPassword:', hashedPassword);
    console.log('plainTextPassword:', plainTextPassword);
    return bcrypt.compare(hashedPassword, plainTextPassword);
  },
  hashPassword: (plainTextPassword) => {
    return bcrypt.hash(plainTextPassword, 10);
  }
}