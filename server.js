const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');

const app = express();

// 引入路由
const users = require('./routes/api/users');

const db = require('./config/keys').mongoURI;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose
  .connect(db)
  .then((result) => {
    console.log('mongodb connected');
  })
  .catch((err) => {
    console.error(err);
  });

app.use(passport.initialize());
const verify = require('./config/passport');
verify(passport);

app.get('/', (req, res) => {
  res.send('welcome');
});

// 添加路由
app.use('/api/users', users);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
