const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const gravatar = require('gravatar');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const User = require('../../models/User');
const passport = require('passport');

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
          identity: 'employee',
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
    .catch((err) => {
      console.log(err);
    });
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
            const rule = { id: user.id, name: user.name };
            console.log(rule);
            jwt.sign(
              rule,
              keys.secretOrKey,
              { expiresIn: 3600 },
              (err, token) => {
                if (err) throw err;
                res.json({
                  success: true,
                  token: 'Bearer ' + token,
                });
              },
            );
          } else {
            return res.status(400).json({ password: '密码错误' });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get(
  '/current',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      identity: req.user.identity,
    });
  },
);

module.exports = router;
