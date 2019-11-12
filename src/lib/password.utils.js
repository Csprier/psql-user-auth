import bcrypt from 'bcryptjs';

module.exports = {
  validatePassword: (plainTextPassword, hashedPassword, user) => {
    console.log('--- Inside validatePassword ---');
    console.log('plainTextPassword:', plainTextPassword);
    console.log('hashedPassword:', hashedPassword);
    return bcrypt.compare(plainTextPassword, hashedPassword)
      .then(validity => {
        return {
          isValid: validity,
          userData: user
        }
      })
      .catch(e => console.error(e));
  },
  hashPassword: (plainTextPassword) => {
    return bcrypt.hash(plainTextPassword, 10);
  }
}