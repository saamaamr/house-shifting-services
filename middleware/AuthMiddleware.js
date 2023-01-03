const jwt = require('jsonwebtoken');
const UserModels = require('../models/UserModels');

require('dotenv').config();
/* ==== Require auth ==== */
const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err) => {
      if (err) {
        console.log(err.massage);
        res.redirect('/login');
      } else {
        console.log('Decoded', decodedToken);
        next();
      }
    });
  } else {
    res.redirect('/login')
  }
}
/* ===== check user ====== */
const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
      if (err) {
        console.log(err.massage);
        res.locals.user = null;
        next();
        res.redirect('/login');
      } else {
        console.log('Decoded', decodedToken);
        const user = await UserModels.mailCatchM(decodedToken.userMail);
        res.locals.user = user;
        next();
      }
    });
  } else {
    res.locals.user = null;
    next()
  }
};

/* ==== check login ==== */
const checkCurrentLogin = (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    res.redirect('/');
  } else {
    // res.redirect('/login');
    next()
  }
}
const redirectLoggedIn = (req, res, next) => {
  const cookie = req.signedCookies[process.env.COOKIE_NAME]
  if (!cookie) {
    next()
  } else {
    res.redirect('/');
  }
}
// exports function
module.exports = { requireAuth, checkUser, checkCurrentLogin, redirectLoggedIn };
