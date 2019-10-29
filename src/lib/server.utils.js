export const serverUtils = {
  // ====================================================================================================
  normalizePort: (val) => { // Normalize a port into a number, string, or false.
    let port = parseInt(val, 10);

    if (isNaN(port)) {
      // named pipe
      return val;
    }

    if (port >= 0) {
      // port number
      return port;
    }
    return false;
  },
  // ====================================================================================================
  onError: (error) => { // Event listener for HTTP server "error" event.
    if (error.syscall !== 'listen') {
      throw error;
    }

    let bind = typeof port === 'string'
      ? 'Pipe ' + port
      : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        console.error(bind + ' requires elevated privileges');
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(bind + ' is already in use');
        process.exit(1);
        break;
      default:
        throw error;
    }
  },
  // ====================================================================================================
  onListening: () => { // Event listener for HTTP server "listening" event.
    const addr = server.address();
    const bind = typeof addr === 'string'
      ? 'pipe ' + addr
      : 'port ' + addr.port;
    debug('Listening on ' + bind);
  }
}