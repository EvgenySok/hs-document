require('dotenv').config()
const { Pool } = require('pg');
const env = process.env.NODE_ENV || 'development'
let connectionString = {}
// if (env === 'development') {
//   connectionString = {
//     user: 'postgres',
//     password: 'sashka',
//     host: 'localhost',
//     port: 5432,
//     database: 'test'
//   }
// } else {
connectionString = {
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
}
// }

const pool = new Pool(connectionString)
pool.on('connect', () => console.log('connected to db'));

module.exports = pool
