const express = require('express');
//
const session = require('express-session')
//
const router = require('./routers/routes');
require('dotenv').config();

const app = express();

//
app.use(session({
  secret:'webslesson',
  resave:true,
  saveUninitialized: true
}))
//

app.use(express.static(`${__dirname}/public`));
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//
app.use(router);

app.listen(process.env.PORT, () => {
  console.log(`Server Running http://localhost:${process.env.PORT}`);
});
