const express = require('express');
require('dotenv').config();
const controller = require('./controller.js');
const app = express();
app.use(express.json());


//----------GET---------
app.get('/qa/questions', (req, res) => {controller.getQuestions(req, res)});
app.get('/qa/answers', (req, res) => {controller.getAnswers(req, res)});
//---------POST---------
app.post('/qa/questions', (req, res) => {controller.addQuestion(req, res)});
app.post('/qa/answers', (req, res) => {controller.addAnswer(req, res)});
//---------PUT QUESTIONS---------

// app.put(/^\/qa\/questions\/(.*)/, (req, res) => {
app.put(/^\/qa\/questions\/[^/]*\/helpful/, (req, res) => {controller.qHelpful(req, res)});
app.put(/^\/qa\/questions\/[^/]*\/report/, (req, res) => {controller.qReport(req, res)});
//---------PUT ANSWERS---------
app.put(/^\/qa\/answers\/[^/]*\/helpful/, (req, res) => {controller.aHelpful(req, res)});
app.put(/^\/qa\/answers\/[^/]*\/report/, (req, res) => {controller.aReport(req, res)});


app.listen(process.env.SERVERPORT || 8000);