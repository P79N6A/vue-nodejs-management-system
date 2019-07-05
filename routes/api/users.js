const express = require('express');
const router = express.Router();

router.get('/test', (req, res) => {
  res.json({ msg: 'login' });
});

router.post('/register', (req, res) => {
  res.json({ msg: 'login' });
});

module.exports = router;
