require('dotenv').config()

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');

require('./helpers/init-mongodb')


const connection_string = process.env.DB_CONNECTION_STRING

var indexRouter = require('./routes/index');
//var usersRouter = require('./routes/users');

var app = express();

app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true
}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', indexRouter);

// app.use('/users', usersRouter);

module.exports = app;
