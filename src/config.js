module.exports = {
  PORT: process.env.PORT || 8080,
  PSQL_CONNECTION_URI: process.env.PSQL_URI || 'postgres://postgres:dev1337@localhost:5432/psql_backend_boilerplate_db',
  JWT_SECRET: process.env.JWT_SECRET || 'themilksgonebad',
	JWT_EXPIRY: process.env.JWT_EXPIRY || '7d'
};