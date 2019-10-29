module.exports = {
  PORT: process.env.PORT || 8080,
  PSQL_CONNECTION_URI: process.env.PSQL_URI || 'postgres://wizard:password@localhost:5432/psqlauthdb'
};