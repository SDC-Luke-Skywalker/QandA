require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PW,
  port: process.env.PORT
})

//----------GET---------
module.exports = {
  getQuestions: (req, res) => (async () => {
    const { rows } = await pool.query(`SELECT * FROM questions WHERE product_id = ${req.query.product_id} ORDER BY question_helpfulness DESC`)
    res.status(200).send(rows);
  })().catch(err => {
    res.status(500).send(err);
  }),
  getAnswers: (req, res) => (async () => {
    const { rows } = await pool.query(`SELECT * FROM answers WHERE question_id = ${req.query.question_id} ORDER BY helpfulness DESC`)
    res.status(200).send(rows);
  })().catch(err => {
    res.status(500).send(err);
  }),

  //---------POST---------
  addQuestion: (req, res) => (async () => {
    let date = new Date();
    let dd = String(date.getDate()).padStart(2, '0');
    let mm = String(date.getMonth() + 1).padStart(2, '0');
    let yyyy = date.getFullYear();
    date = mm + '/' + dd + '/' + yyyy;
    let values = [req.query.product_id, req.body.body, date, req.body.name, req.body.email, false, 0];
    await pool.query(`INSERT INTO questions (product_id, question_body, question_date, asker_name, asker_email, reported, question_helpfulness) VALUES($1, $2, $3, $4, $5, $6, $7)`, values)
    res.status(201).end()
  })().catch(err => {
    res.status(500).send(err);
  }),
  addAnswer: (req, res) => (async () => {
    let date = new Date();
    let dd = String(date.getDate()).padStart(2, '0');
    let mm = String(date.getMonth() + 1).padStart(2, '0');
    let yyyy = date.getFullYear();
    date = mm + '/' + dd + '/' + yyyy;
    // let photos = '{\"' + req.body.photos.reduce((prev, current) => prev + '\", \"' + current) + '\"}';
    let values = [req.query.question_id, req.body.body, date, req.body.name, req.body.email, 0, false, req.body.photos];
    await pool.query(`INSERT INTO answers (question_id, body, date, answerer_name, answerer_email, helpfulness, reported, photos) VALUES($1, $2, $3, $4, $5, $6, $7, $8)`, values)
    res.status(201).end()
  })().catch(err => {
    console.log(err);
    res.status(500).send(err);
  }),

  //---------PUT QUESTIONS---------
  qHelpful: (req, res) => (async () => {
    await pool.query(`UPDATE questions SET question_helpfulness = question_helpfulness + 1 WHERE question_id = ${req.query.question_id}`)
    res.status(204).end();
  })().catch(err => {
    res.status(500).send(err);
  }),
  qReport: (req, res) => (async () => {
    await pool.query(`UPDATE questions SET reported = NOT reported WHERE question_id = ${req.query.question_id}`)
    res.status(204).end()
  })().catch(err => {
    res.status(500).send(err);
  }),

  //---------PUT ANSWERS---------
  aHelpful: (req, res) => (async () => {
    await pool.query(`UPDATE answers SET helpfulness = helpfulness + 1 WHERE answer_id = ${req.query.answer_id}`)
    res.status(204).end();
  })().catch(err => {
    res.status(500).send(err);
  }),
  aReport: (req, res) => (async () => {
    await pool.query(`UPDATE answers SET reported = NOT reported WHERE answer_id = ${req.query.answer_id}`)
    res.status(204).end();
  })().catch(err => {
    res.status(500).send(err);
  })
};

