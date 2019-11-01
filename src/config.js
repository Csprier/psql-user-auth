module.exports = {
  PORT: process.env.PORT || 8080,
  PSQL_CONNECTION_URI: process.env.PSQL_URI || 'postgres://wizard:password@localhost:5432/psqlauthdb',
  JWT_SECRET: process.env.JWT_SECRET,
	JWT_EXPIRY: process.env.JWT_EXPIRY || '7d'
};