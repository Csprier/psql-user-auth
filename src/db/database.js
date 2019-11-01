/**
 * https://node-postgres.com/guides/project-structure
 * Code in this files comes from the link on Line 2.
 */

const { Pool } = require('pg');
const connectionString = 'postgres://wizard:password@localhost:5432/psqlauthdb';
const pool = new Pool({
  connectionString: connectionString
});

module.exports = {
  query: (queryText, params) => {
    console.log('Query Text:', queryText, ' with ', params);
    return new Promise((resolve, reject) => {
      pool.query(queryText, params)
        .then(res => resolve(res.rows))
        .catch(e => reject(e.stack));
      }
    );
  },
  getClient: (callback) => {
    pool.connect((err, client, done) => {
      const query = client.query.bind(client);

      // monkey patch the query method to keep track of the last query executed
      client.query = () => {
        client.lastQuery = arguments
        client.query.apply(client, arguments);
      };

      // set a timeout of 5 seconds, after which we will log this client's last query
      const timeout = setTimeout(() => {
        console.error('A client has been checked out for more than 5 seconds!')
        console.error(`The last executed query on this client was: ${client.lastQuery}`)
      }, 5000);

      const release = (err) => {
        // call the actual 'done' method, returning this client to the pool
        done(err);
        // clear our timeout
        clearTimeout(timeout);
        // set the query method back to its old un-monkey-patched version
        client.query = query
      };

      callback(err, client, release);
    });
  },
};