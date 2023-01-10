const express = require('express');
const cookieParser = require('cookie-parser');
const env = require('dotenv');
const router = require('./routers/routes');

//
const {
  checkUser,
} = require('./middleware/AuthMiddleware');
//??-->
// require('dotenv').config();

const app = express();
env.config();

//??-->
const session = require('express-session')
app.use(cookieParser(process.env.COOKIE_SECRET))

app.use(session({
  secret: process.env.COOKIE_SECRET,
  resave: false,
  saveUninitialized: false,
}))

if (typeof localStorage === "undefined" || localStorage === null) {
  let LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}
//??-->

app.use(express.static(`${__dirname}/public`));
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser())
app.use(express.json())
app.use('*',checkUser)
app.use(router);

app.listen(process.env.PORT, () => {
  console.log(`Server Running http://localhost:${process.env.PORT}`);
});


