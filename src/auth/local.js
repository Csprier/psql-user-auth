import db from '../db/database';
const { Strategy: LocalStrategy } = require('passport-local');
import { validatePassword } from '../lib/password.utils';

const localStrategy = new LocalStrategy((username, password, done) => {
  // let user;
  const queryForUserExistence = 'SELECT * FROM users WHERE username = $1;',
        params = [ username ];
  db.query(queryForUserExistence, params)
    .then(result => {
			let user = result[0];
			// console.log(user);
      if (!user) {
				return Promise.reject({
					reason: 'LoginError',
					message: 'Incorrect username',
					location: 'username'
        });
			}
			let hashedPassword = user.password,
					plaintTextPassword = password;
			// console.log('HP', hashedPassword);
			// console.log('PTP', plaintTextPassword);
      return validatePassword(plaintTextPassword, hashedPassword, user);
    })
    .then(validUser => {
			console.log('isValid', validUser.isValid);
			console.log('userData', validUser.userData);
			if (!validUser.isValid) {
				return Promise.reject({
					reason: 'LoginError',
					message: 'Incorrect password',
					location: 'password'
				});
			}
			return done(null, validUser.userData);
		})
    .catch(err => {
      if (err.reason === 'LoginError') {
				return done(null, false);
			}
			return done(err);
    });
});

module.exports = localStrategy;