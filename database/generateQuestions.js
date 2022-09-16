require('dotenv').config();
const { parse } = require('csv-parse');
const fs = require('fs');
const { Client} = require('pg');


async function createTable() {
  const client = new Client({
    user: process.env.USER,
    host: process.env.HOST,
    database: process.env.DATABASE,
    password: process.env.PW,
    port: process.env.PORT
  })
  await client.connect();
  await client.query(`CREATE TABLE questions (
    question_id INT PRIMARY KEY UNIQUE,
    product_id INT,
    question_body TEXT,
    question_date DATE,
    asker_name TEXT,
    asker_email TEXT,
    reported BOOLEAN,
    question_helpfulness INT
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
    const parser = fs.createReadStream('./questions.csv')
      .pipe(parse({
        skip_records_with_error: true,
        columns: true,
        to_line: 10
      })
      );
    process.stdout.write('start\n');
    for await (const record of parser) {
      var date = new Date(parseInt(record.date_written)).toLocaleDateString('sv').replace(/\//g, '-');
      let text =  `INSERT INTO questions (question_id, product_id, question_body, question_date, asker_name, asker_email, reported, question_helpfulness) VALUES($1, $2, $3, $4, $5, $6, $7, $8)`
      let values = [
        parseInt(record.id),
        parseInt(record.product_id),
        record.body,
        date,
        record.asker_name,
        record.asker_email,
        !!parseInt(record.reported),
        parseInt(record.helpful)
      ]
      await client.query(text, values);
    }
  })();
}();

(async () => {
  await createTable()
  await populateTable();
})();