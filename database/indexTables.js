require('dotenv').config();
const { parse } = require('csv-parse');
const fs = require('fs');
const { Client } = require('pg');


async function indexTables() {
  const client = new Client({
    user: process.env.USER,
    host: process.env.HOST,
    database: process.env.DATABASE,
    password: process.env.PW,
    port: process.env.PORT
  })
  await client.connect();
  await client.query(`CREATE INDEX question_id_index ON questions (question_id)`);
  await client.query(`CREATE INDEX answer_id_index ON answers (answer_id)`);
  await client.query(`CREATE INDEX question_id_index ON answers (question_id)`);
  await client.query(`CREATE INDEX product_id_index ON questions (product_id)`);
  client.end();
}