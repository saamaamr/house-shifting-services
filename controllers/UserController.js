const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const { validationResult } = require('express-validator');
const UserModels = require('../models/UserModels');
const { checkCurrentLogin } = require('../middleware/AuthMiddleware');

require('dotenv').config();

const maxAge = 3 * 24 * 60 * 60 * 1000;

/*===== Mail Confirmation =====*/
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'houseshiftingserviceanwara@gmail.com',
    pass: 'rfltsxwlieliwbru',
  },
});
//

async function sendMail(toMail, subject, textMessage, htmlMessage) {
  // send mail with defined transport object
  const results = await transporter.sendMail({
    from: 'House Shifting Service 🔓📨 <houseshiftingserviceanwara@gmail.com>',
    to: toMail,
    subject,
    text: textMessage,
    html: htmlMessage,
  })
  return results
}
/*==== Controlers ====*/
const UserController = {

  getHome: async (req, res) => {
    const allService = await UserModels.getaService()
    const uId=localStorage.getItem("userMail");
    const userData = await UserModels.getUser(uId)    
    res.render('pages/home', { uId, allService,userData })
  },
  getAbout: async (req, res) => {
    const uId=localStorage.getItem("userMail");
    const userData = await UserModels.getUser(uId)
// console.log({ userData })
{ uId, userData }
    res.render('pages/about',{ uId, userData })
  },
  getContact: async (req, res) => {
    const uId=localStorage.getItem("userMail");
    const userData = await UserModels.getUser(uId)

    res.render('pages/contact',{ uId, userData })
  },
  getOffer: async (req, res) => {
    const uId=localStorage.getItem("userMail");
    const userData = await UserModels.getUser(uId)

    res.render('pages/offer',{ uId, userData })
  },
  getServices: async (req, res) => {
  
    const allService = await UserModels.getaService()
    const uId=localStorage.getItem("userMail");
    const userData = await UserModels.getUser(uId)
{ uId, userData }
    res.render('pages/services', { allService, uId, userData })
  },
  // Admin Related
  getAdmin: async (req, res) => {
    res.render('pages/admin')
  },
  getBooking: async (req, res) => {
    res.render('pages/booking')
  },
  getUser: async (req, res) => {
    const uId=localStorage.getItem("userMail");
    const user = await UserModels.getUser(uId)
    res.render('pages/user',{uId,user})
  },
  getWorker: async (req, res) => {
    res.render('pages/worker')
  },


  getServiceData: async (req, res) => {
    const allService = await UserModels.getaService()
    res.render('pages/service', { allService })
  },

  
  serviceData: async (req, res) => {
    try {
      const {
        stitle, items, details, price, date, status
      } = req.body;
      const servie = await UserModels.servie(stitle, items, details, price, date, status);
      if (servie.errno) {
        res.send('Something went wrong')
      } else {
        res.redirect('/service')
      }
    } catch (e) {
      console.log(e);
      res.send('Wrong')
    }
  },

   /* login controller */
  loginC: async (req, res) => {
    try {
      const { email, pass } = req.body;
      // console.log('Body', email, pass);
      // error msg
      const errors = validationResult(req).formatWith((error) => error.msg);
      console.log({ errors })
      if (!errors.isEmpty()) {
        console.log("work.......", errors)
        return res.render('pages/login', {
          error: errors.mapped(),
          value: { email, pass },
        });
      }
      const user = await UserModels.mailCatchM(email);
      const userName = user[0].first_name;
      const userMail = user[0].email;
      const password = user[0].pass;
      console.log({ user })
      console.log("check user", user !== '')
      console.log(user[0].u_id !== '')


      if (user[0].u_id !== '') {
        console.log("is it work....")
        const isValidPassword = await bcrypt.compare(pass, password);
        if (isValidPassword) {
          console.log("pass ok", isValidPassword)

          localStorage.setItem('userMail',`${userMail}`)

          const token = jwt.sign(
            {
              name: userName,
              mail: userMail,
            },
            process.env.JWT_SECRET,
            { expiresIn: maxAge },
          )
          console.log("token", token !== null)
          if (token !== null) {
            res.cookie(process.env.COOKIE_NAME, token, { maxAge, httpOnly: true, signed: true });
            console.log("ok token", user)
            const allService = await UserModels.getaService()
            const uId=localStorage.getItem("userMail");
            const userData = await UserModels.getUser(uId)
            console.log({ userData })
            
            res.render('pages/home', { uId, allService,userData })
            // res.render('pages/login',{ title: 'Express', session: req.session })

            

            // res.redirect('/',{ user });
            console.log("endd................")
          }
        } else {
          res.render('pages/login', { auth: true });
        }
      } else {
        console.log("have error")
        res.render('pages/login', { auth: true });
      }
    } catch (err) {
      res.render('pages/login', {
        auth: true,
        data: {
          email: req.body.email,
        },
        errors: {
          common: {
            msg: err.message,
          },
        },
      });
      // console.log(errors)
    }
  },

  /* ====== New register  Controller  ====== */

  registerC: async (req, res) => {
    res.render('pages/signup');
  },
  /* ====== New login Controller  ====== */

  newlogin: async (req, res) => {
    res.render('pages/login');
  },
  /* ====== Profile Controller  ====== */
  profile: async (req, res) => {
    const uId=localStorage.getItem("userMail");
    const userData = await UserModels.getUser(uId)

    res.render('pages/userprofile',{ uId, userData });
  },

  /* ====== Register controller ====== */
  insertRegisterC: async (req, res) => {
    const { firstName, lastName, email, phone, house, road, division, zila, upazila, role, pass } = req.body;
    const errors = validationResult(req).formatWith((error) => error.msg);
    console.log("work.......", errors)
    if (!errors.isEmpty()) {
      return res.render('pages/signup', {
        error: errors.mapped(),
        value: { firstName, lastName, email, phone, house, road, division, zila, upazila, role, pass },
      });
    } try {
      const hashPassword = await bcrypt.hash(pass, 10);
      const registerData = await UserModels.insertRegisterM(
        firstName, lastName, email, phone, house, road, division, zila, upazila, role, hashPassword
      );


      const toMail = "houseshiftingserviceanwara@gmail.com"
      const subject = 'House Shifting Service active account';
      const textMessage = 'House Shifting Service account verify'
      const link = `${process.env.BASE_UR}`
      console.log("before")
      const activeBtn = `
      <div style="padding: 0px 20px;margin-left: 8px;text-align: center;">
      <h4>Wellcome  ${firstName} ${lastName}.<h4>
      <p>If you are ${firstName} ${lastName}.<p> <br>
      <p>Please House Shifting Service account verify. Othewise ignore the mail. <p>
      </div>
      <div>
      <a style="cursor: pointer;" href="http://localhost:3000/verify-account/${registerData[0].insertId}">
      <button style="padding: 0px 20px;
      border-radius: 8px;
      background-color: #188bde;
      border : none;
      font-size: 15px;
      font-weight: 700;
      line-height: 36px;
      color: #FFFFFF;
      margin-left: 8px;
      text-align: center;
      cursor: pointer;">
      Active account</button></a>
      </div>
      `
      const workeractiveBtn = `
      <div>
      <h4>Worker Name: ${firstName} ${lastName}<h4>
      <h5>Email: ${email}<h5>
      <h5>Phone: ${phone}<h5>
      <h5>Area: ${upazila} , ${zila} , ${division}<h5>
      </div>
      <div>
      <a style="cursor: pointer;" href="http://localhost:3000/verify-account/${registerData[0].insertId}">
      <button style="padding: 0px 20px;
      border-radius: 8px;
      background-color: #188bde;
      border : none;
      font-size: 15px;
      font-weight: 700;
      line-height: 36px;
      color: #FFFFFF;
      margin-left: 8px;
      text-align: center;
      cursor: pointer;">
      Active your worker account</button></a>
      </div>
      `
      
      console.log('regis data', registerData);
      console.log("id",registerData[0].insertId)
      if(role== "worker"){
        sendMail(toMail, subject, textMessage, workeractiveBtn)
      return res.render('pages/signup', { workerauth: true });

      }else{
        console.log('Body', role=="user");
        sendMail(email, subject, textMessage, activeBtn)
      return res.render('pages/signup', { auth: true });
      }
      // res.redirect('/login')
    } catch (err) {
      console.log('register data Error');
      return res.render('pages/signup', { registerFail: true });
    }
  },
  /* ====== Logout Controller  ====== */
  logout: async (req, res) => {
    res.cookie(process.env.COOKIE_NAME, '', { maxAge, httpOnly: true, signed: true });
    localStorage.removeItem('userMail');
    res.redirect('/');
  },
  accountVerify: async (req, res) => {
    const userId = req.params.id
    console.log({ userId })
    const isUpdate = await UserModels.updateStatus(userId)
    if (isUpdate.affectedRows) {
      res.redirect('/login')
    }
  },

}
module.exports = UserController
