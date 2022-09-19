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
    const { rows } = await pool.query(`SELECT questions.product_id, questions.question_id, questions.question_body, questions.question_date, questions.asker_name, questions.question_helpfulness, questions.reported, answers.answer_id AS id, answers.body, answers.date, answers.answerer_name, answers.helpfulness, answers.photos FROM questions LEFT OUTER JOIN answers ON questions.question_id = answers.question_id WHERE questions.product_id = ${req.query.product_id} ORDER BY questions.question_helpfulness DESC`)
    let data = {product_id: req.query.product_id};
    let results = [];
    let resultTracker = {};
    for (var row of rows) {
      if (resultTracker[row.question_id]) {
        let answer = row.id ? {} : null;
        if (answer) {
          answer = {
            id: row.id,
            body: row.body,
            date: row.date,
            answerer_name: row.answerer_name,
            helpfulness: row.helpfulness,
            photos: row.photos
          };
          resultTracker[row.question_id].answers[answer.id] = answer;
        }
      } else {
        resultTracker[row.question_id] = {
          question_id: row.question_id,
          question_body: row.question_body,
          question_date: row.question_date,
          asker_name: row.asker_name,
          question_helpfulness: row.question_helpfulness,
          reported: row.reported,
          answers: {}
        }
        let answer = row.id ? {} : null;
        if (answer) {
          answer = {
            id: row.id,
            body: row.body,
            date: row.date,
            answerer_name: row.answerer_name,
            helpfulness: row.helpfulness,
            photos: row.photos
          };
          resultTracker[row.question_id].answers[answer.id] = answer;
        }
      }
    }
    let questions = Object.values(resultTracker);
    questions.forEach((question) => {
      results.push(question)
    });
    console.log(req.query.count);
    let count = req.query.count || 5;
    data.results = results.slice(0, count);
    res.status(200).send(data);
  })().catch(err => {
    console.log(err);
    res.status(500).send(err);
  }),
  getAnswers: (req, res) => (async () => {
    const { rows } = await pool.query(`SELECT * FROM answers WHERE question_id = ${req.query.question_id} ORDER BY helpfulness DESC`)
    let data = {};
    data.question = JSON.stringify(rows[0].question_id);
    data.page = 0; //FIXME: how do I define page?
    data.count = rows.length;
    data.results = rows;
    res.status(200).send(data);
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
    let values = [req.query.question_id, req.body.body, date, req.body.name, req.body.email, 0, false, req.body.photos];
    await pool.query(`INSERT INTO answers (question_id, body, date, answerer_name, answerer_email, helpfulness, reported, photos) VALUES($1, $2, $3, $4, $5, $6, $7, $8)`, values)
    res.status(201).end()
  })().catch(err => {
    console.log(err);
    res.status(500).send(err);
  }),

  //---------PUT QUESTIONS---------
  qHelpful: (req, res) => (async () => {
    let path = req.path;
    path = path.split('/');
    let question_id = path[3];
    await pool.query(`UPDATE questions SET question_helpfulness = question_helpfulness + 1 WHERE question_id = ${question_id}`)
    res.status(204).end();
  })().catch(err => {
    res.status(500).send(err);
  }),
  qReport: (req, res) => (async () => {
    let path = req.path;
    path = path.split('/');
    let question_id = path[3];
    await pool.query(`UPDATE questions SET reported = NOT reported WHERE question_id = ${question_id}`)
    res.status(204).end()
  })().catch(err => {
    res.status(500).send(err);
  }),

  //---------PUT ANSWERS---------
  aHelpful: (req, res) => (async () => {
    let path = req.path;
    path = path.split('/');
    let answer_id = path[3];
    await pool.query(`UPDATE answers SET helpfulness = helpfulness + 1 WHERE answer_id = ${answer_id}`)
    res.status(204).end();
  })().catch(err => {
    res.status(500).send(err);
  }),
  aReport: (req, res) => (async () => {
    let path = req.path;
    path = path.split('/');
    let answer_id = path[3];
    await pool.query(`UPDATE answers SET reported = NOT reported WHERE answer_id = ${answer_id}`)
    res.status(204).end();
  })().catch(err => {
    res.status(500).send(err);
  })
};

