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
			console.log(user);
      if (!user) {
				return Promise.reject({
					reason: 'LoginError',
					message: 'Incorrect username',
					location: 'username'
        });
			}
			console.log('--- Inside localStrategy ---');
			console.log('user.password:', user.password);
			console.log('password:', password);
			console.log('--- Validating ---');
      return validatePassword(user.password, password);
    })
    .then(isValid => {
			if (!isValid) {
				return Promise.reject({
					reason: 'LoginError',
					message: 'Incorrect password',
					location: 'password'
				});
			}
			return done(null, user);
		})
    .catch(err => {
      if (err.reason === 'LoginError') {
				return done(null, false);
			}
			return done(err);
    });
});

module.exports = localStrategy;