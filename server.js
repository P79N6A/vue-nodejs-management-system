const express = require('express');
const mongoose = require('mongoose');

const app = express();

// 引入路由
const users = require('./routes/api/users');

const db = require('./config/keys').mongoURI;

mongoose
  .connect(db)
  .then((result) => {
    console.log('connected');
  })
  .catch((err) => {
    console.error(err);
  });

app.get('/', (req, res) => {
  res.send('welcome');
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
