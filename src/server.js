// ===============================================================================================
// Require dotenv
require('dotenv').config();

import cors from 'cors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
// Passport & Strategies
import passport from 'passport';
import localStrategy from './auth/local';
import jwtStrategy from './auth/jwt';

// Routers
import indexRouter from './routes/index';
import userRouter from './routes/users.routes';

// Instance
const app = express();

// ===============================================================================================
// CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, X-Access-Token, XKey, Authorization');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.options('*', cors());

// ===============================================================================================
// Utilize the given `strategies`
passport.use(localStrategy);
passport.use(jwtStrategy);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// Passport middleware functions
app.use(passport.initialize());
app.use(passport.session());

// Static
app.use(express.static(path.join(__dirname, '../public')));

// ======================================================
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
});

// Mount Routers
app.use('/', indexRouter);
app.use('/users', userRouter);

// ======================================================
// ERROR HANDLING
// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err
  });
});
// ======================================================

// ======================================================
// POSTGRESQL DATABASE CONNECTION
import pg from 'pg';
const connectionString = process.env.PSQL_CONNECTION_URI || 'postgres://wizard:password@localhost:5432/psqlauthdb';
const client = new pg.Client(connectionString);
import db from './db/database';
client.connect(() => {
  console.log('-- Connecting to database from entry point --');
  console.log('');
  db.query('SELECT * FROM users;')
    .then(result => {
      console.log('-- Connection test query results --');
      console.log(result);
      console.log('-- End Test Query --');  
    })
    .catch(err => console.error(err));
});

export default app;