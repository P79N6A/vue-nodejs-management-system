const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const User = require('../../models/User');
router.get('/test', (req, res) => {
  res.json({ msg: 'login' });
});

router.post('/register', (req, res) => {
  // console.log(req.body);
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (user) {
        return res.status(400).json({ email: '邮箱已注册' });
      } else {
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          // avatar,
          password: req.body.password,
        });
        // 加密存储密码
        bcrypt.genSalt(10, function(err, salt) {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            // Store hash in your password DB.
            if (err) throw err;
            newUser.password = hash;
            // 保存密码到数据库
            newUser
              .save()
              .then((user) => {
                res.json(user);
              })
              .catch((err) => {
                console.log(err);
              });
          });
        });
      }
    })
    .catch((err) => {});
});

module.exports = router;
