// db.js
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'db',
  database: 'newdb', 
  password: 'postgres', 
  port: 5432
})

module.exports = pool;