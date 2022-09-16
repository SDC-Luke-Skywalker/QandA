require('dotenv').config();
const { parse } = require('csv-parse');
const fs = require('fs');
const { Client } = require('pg');


async function createTable() {
  const client = new Client({
    user: process.env.USER,
    host: process.env.HOST,
    database: process.env.DATABASE,
    password: process.env.PW,
    port: process.env.PORT
  })
  await client.connect();
  await client.query(`DROP TABLE IF EXISTS answers`)
  await client.query(`CREATE TABLE answers (
    answer_id INT PRIMARY KEY UNIQUE,
    question_id INT references questions(question_id),
    body TEXT,
    date DATE,
    answerer_name TEXT,
    answerer_email TEXT,
    helpfulness INT,
    reported BOOLEAN,
    photos text[]
    );`)
  client.end();
  return;
};

async function populateTable() {
  const client = new Client({
    user: process.env.USER,
    host: process.env.HOST,
    database: process.env.DATABASE,
    password: process.env.PW,
    port: process.env.PORT
  });
  await client.connect();
  await (async () => {
    const parser = fs.createReadStream('./answers.csv')
      .pipe(parse({
        skip_records_with_error: true,
        columns: true,
      })
      );
    process.stdout.write('start\n');
    for await (const record of parser) {
      var date = new Date(parseInt(record.date_written)).toLocaleDateString('sv').replace(/\//g, '-');
      let text = `INSERT INTO answers (answer_id, question_id, body, date, answerer_name, answerer_email, helpfulness, reported) VALUES($1, $2, $3, $4, $5, $6, $7, $8)`
      let values = [
        parseInt(record.id),
        parseInt(record.question_id),
        record.body,
        date,
        record.answerer_name,
        record.answerer_email,
        parseInt(record.helpful),
        !!parseInt(record.reported)
      ];
      console.log (values);
      await client.query(text, values);
    }
  })();
};

(async () => {
  await createTable()
  await populateTable();
})();
