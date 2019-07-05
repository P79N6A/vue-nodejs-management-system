const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const gravatar = require('gravatar');

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
        const avatar = gravatar.url('fxyf1991@gmail.com', {
          s: '200',
          r: 'pg',
          d: 'mm',
        });

        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          avatar,
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

router.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ email: '用户不存在' });
      }
      // 匹配密码
      bcrypt
        .compare(password, user.password)
        .then((isMatch) => {
          if (isMatch) {
            res.json({ msg: 'success' });
          } else {
            return res.status(400).json({ password: '密码错误' });
          }
        })
        .catch((err) => {});
    })
    .catch((err) => {});
});

module.exports = router;
