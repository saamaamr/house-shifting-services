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
    res.render('pages/home')
  },
  getAbout: async (req, res) => {
    res.render('pages/about')
  },
  getContact: async (req, res) => {
    res.render('pages/contact')
  },
  getOffer: async (req, res) => {
    res.render('pages/offer')
  },
  getServices: async (req, res) => {
    // console.log("work.......services")
    const allService = await UserModels.getaService()
    // console.log({allService})
    res.render('pages/services', { allService })
  },
  // Admin Related
  getAdmin: async (req, res) => {
    res.render('pages/admin')
  },
  getBooking: async (req, res) => {
    res.render('pages/booking')
  },
  getUser: async (req, res) => {
    res.render('pages/user',)
  },
  getWorker: async (req, res) => {
    res.render('pages/worker')
  },
  // getSignupForm: async (req, res) => {
  //   res.render('pages/signup')
  // },
  // getLoginForm: async (req, res) => {
  //   res.render('pages/login')
  // },
  // signupData: async (req, res) => {
  //   try {
  //     const {
  //       firstName, lastName, email, phone, house, road, division, upazila, zila, role, pass,
  //     } = req.body;
  //     const hash = await bcrypt.hash(pass, 10);
  //     const signup = await UserModels.signup(firstName, lastName, email, phone, house, road, division, upazila, zila, role, hash);

  //     if (signup.errno) {
  //       res.send('Something went wrong')
  //     } else {
  //       res.redirect('/login')
  //     }
  //   } catch (e) {
  //     console.log(e);
  //     res.send('Wrong')
  //   }
  // },

  getServiceData: async (req, res) => {
    const allService = await UserModels.getaService()
    // console.log("work.......")
    // console.log({allService})
    res.render('pages/service', { allService })
  },

  // getloginForm: async (req, res) => {
  //   res.render('pages/login', { title: 'Express', session: req.session })
  // },

  // loginData: async (req, res) => {
  //   try {
  //     const {
  //       email, role, pass,
  //     } = req.body;

  //     if (email && pass && role) {
  //       const login = await UserModels.login(email);
  //       if (login.length > 0) {
  //         for (let i = 0; i < login.length; i++) {
  //           const validPass = await bcrypt.compare(pass, login[i].pass);
  //           if (validPass && login[i].role == role) {
  //             req.session.u_id = login[i].u_id;
  //             req.session.first_name = login[i].first_name;
  //             req.session.last_name = login[i].last_name;
  //             req.session.role = login[i].role;
  //             console.log("test", login)
  //             res.redirect('/login');
  //           }
  //           else {
  //             res.send('Incorrect Password or Role');
  //           }
  //         }
  //       }
  //       else {
  //         res.send('Incorrect Email Address');
  //       }
  //       res.end();
  //     }
  //     else {
  //       res.send('Please enter your email, password and role, If you have no account please sign up.')
  //       res.end();
  //     }
  //   } catch (e) {
  //     console.log(e);
  //     res.send('Wrong')
  //   }
  // },

  // // Loging Controler 
  //   loginControler: async (req, res) => {
  //     console.log("ok...")
  //     const { email, pass } = req.body;
  //     console.log(email, pass)
  //     const errors = validationResult(req).formatWith((error) => error.msg);
  //     if (!errors.isEmpty()) {
  //       return res.render('pages/login', {
  //         error: errors.mapped(),
  //         value: { email, pass },
  //       })
  //     } try {
  //       const getEmail = await UserModels.getLoginEmail(email);
  //       console.log(getEmail)
  //       const userFirstName = getEmail[0].first_name;
  //       const userLastName = getEmail[0].last_name;
  //       const userEmail = getEmail[0].email;
  //       const userPassword = getEmail[0].pass;
  //       if (getEmail) {
  //         const isValidPass = await bcrypt.compare(pass, userPassword);
  //         if (isValidPass) {
  //           const token = jwt.sign(
  //             {
  //               userFirstName, userLastName,userEmail,
  //             },
  //             process.env.JWT_SECRET,
  //             { expiresIn: maxAge },
  //           )
  //           res.cookie('jwt', token, { maxAge })
  //           res.redirect('/login');
  //         }else{
  //           res.render('pages/login',{auth: true})
  //         }
  //       }else{
  //         res.render('pages/login',{auth: true})
  //       }
  //     } catch (err) {
  //       res.render('pages/login',{
  //         auth: true,
  //         data :{
  //           email: req.body.email,
  //         },
  //         errors: {
  //           common: {
  //             msg: err.message,
  //           }
  //         }
  //       })
  //     }
  //   },

  // userData: async (req, res) => {
  //   res.render('pages/home')
  // },


  // getlogout: (req, res) => {
  //   req.session.destroy();
  //   res.redirect('/')
  // },

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
// const umBtn = document.getElementById('lgnBtn')
// console.log(document.getElementById('lgnBtn'))
// umBtn.addEventListener('click',(e)=>{  
//   if(umBtn.attributes.value.value=="userMail"){
//       localStorage.setItem('userMail',`${userMail}`)
//   }
// })
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
            
            res.render('pages/home', { user })
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
    res.render('pages/profile');
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
    res.redirect('/login');
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
