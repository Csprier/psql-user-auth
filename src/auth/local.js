import db from '../db/database';
const { Strategy: LocalStrategy } = require('passport-local');


const localStrategy = new LocalStrategy((username, password, done) => {
  let user;
  const queryForUserExistence = 'SELECT * FROM users WHERE username = $1;',
        params = [ username ];
  db.query(queryForUserExistence, params)
    .then(result => {
      user = results[0];
      if (!user) {
				return Promise.reject({
					reason: 'LoginError',
					message: 'Incorrect username',
					location: 'username'
        });
      }
      return user.validatePassword(password);
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