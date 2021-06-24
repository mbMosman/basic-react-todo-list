const pg = require('pg');
const url = require('url');

// Project database name
const DEFAULT_DB_NAME = 'basic-todo';

// Template pg config
// No changes required below to reuse for other projects
let config = {
  user: process.env.PG_USER || null, 
  password: process.env.DATABASE_SECRET || null, 
  host: process.env.DATABASE_SERVER || 'localhost', 
  port: process.env.DATABASE_PORT || 5432, 
  database: process.env.DATABASE_NAME || DEFAULT_DB_NAME, 
  max: 10, 
  idleTimeoutMillis: 30000, 
};

if (process.env.DATABASE_URL) {
  // Turns a URL into config object (used by heroku deployment)
  let params = url.parse(process.env.DATABASE_URL);
  let auth = params.auth.split(':');

  config = {
    user: auth[0],
    password: auth[1],
    host: params.hostname,
    port: params.port,
    database: params.pathname.split('/')[1],
    ssl: true, // heroku requires ssl to be true
    max: 10,   // max number of clients in the pool
    idleTimeoutMillis: 30000, // idle time allowed before being closed
  };

}

module.exports = new pg.Pool(config);