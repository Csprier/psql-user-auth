#!/usr/bin/env node
// bin/www.js
// ============================================================

// Module dependencies.
import app from '../server';
import { serverUtils } from '../lib/server.utils';
import debugLib from 'debug';
import http from 'http';
const debug = debugLib('psql_backend_boilerplate_db:server');

// Get port from environment and store in Express.
const port = serverUtils.normalizePort(process.env.PORT || '8080');
app.set('port', port);

// Create HTTP server.
const server = http.createServer(app).listen(port, () => {
  console.log(`listening on *:${port}`);
});