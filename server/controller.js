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
  getQuestions: (req, res) => {
    pool.query(`SELECT * FROM questions WHERE product_id = ${req.query.product_id}`)
    .then((query) => {
      console.log(query);
    })
  },
  getAnswers: (req, res) => {

  },
//---------POST---------
  addQuestion: (req, res) => {

  },
  addAnswer: (req, res) => {

  },
//---------PUT QUESTIONS---------
  qHelpful: (req, res) => {

  },

  qReport: (req, res) => {

  },
//---------PUT ANSWERS---------
  aHelpful: (req, res) => {

  },
  aReport: (req, res) => {

  }
};

