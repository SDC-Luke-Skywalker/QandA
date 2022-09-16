require('dotenv').config();
const { parse } = require('csv-parse');
const fs = require('fs');
const { Client } = require('pg');

(async function populateTable() {
  const client = new Client({
    user: process.env.USER,
    host: process.env.HOST,
    database: process.env.DATABASE,
    password: process.env.PW,
    port: process.env.PORT
  });
  await client.connect();
  await (async () => {
    const parser = fs.createReadStream('./answers_photos.csv')
      .pipe(parse({
        skip_records_with_error: true,
        columns: true,
      })
      );
    process.stdout.write('start\n');
    for await (const record of parser) {
      let text = `UPDATE answers SET photos = array_append(photos, $1) WHERE answer_id = $2`;
      let values = [record.url, parseInt(record.answer_id)];
      await client.query(text, values);
    }
  })();
})();