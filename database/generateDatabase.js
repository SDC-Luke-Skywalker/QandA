require('dotenv').config();
const { parse } = require('csv-parse');
const fs = require('fs');
const { Client} = require('pg');


(async function createDatabase() {
  const client = new Client({
    user: process.env.USER,
    host: process.env.HOST,
    database: 'postgres',
    password: process.env.PW,
    port: process.env.PORT
  });
  await client.connect();
  await client.query(`DROP DATABASE IF EXISTS ${process.env.DATABASE}`);
  await client.query(`CREATE DATABASE ${process.env.DATABASE} WITH ENCODING 'UTF8';`);
  client.end();
})();