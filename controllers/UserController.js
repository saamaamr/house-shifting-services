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
    const uId = localStorage.getItem("userMail");
    const userData = await UserModels.getUser(uId)
    res.render('pages/home', { uId, allService, userData })
  },
  getAbout: async (req, res) => {
    const uId = localStorage.getItem("userMail");
    const userData = await UserModels.getUser(uId)
    // console.log({ userData })
    res.render('pages/about', { uId, userData })
  },
  getContact: async (req, res) => {
    const uId = localStorage.getItem("userMail");
    const userData = await UserModels.getUser(uId)

    res.render('pages/contact', { uId, userData })
  },
  getOffer: async (req, res) => {
    const uId = localStorage.getItem("userMail");
    const userData = await UserModels.getUser(uId)

    res.render('pages/offer', { uId, userData })
  },
  getServices: async (req, res) => {

    const allService = await UserModels.getaService()
    const uId = localStorage.getItem("userMail");
    const userData = await UserModels.getUser(uId);
    res.render('pages/services', { allService, uId, userData })
  },
  // Admin Related
  getAdmin: async (req, res) => {
    const allUser = await UserModels.getallUser()
    const allService = await UserModels.getaService()
    const allWorker = await UserModels.getallWorker()
    const allBooking = await UserModels.getallBooking()
    const adminData = localStorage.getItem("adminData");

    res.render('pages/admin', { allUser, allService, allWorker, allBooking, adminData  })
  },
  getBooking: async (req, res) => {
    const allBooking = await UserModels.getallBooking()
    const allUser = await UserModels.getallUser()
   console.log("Booking",allBooking,"Booking",allUser )
    res.render('pages/booking', { allBooking, allUser })
  },
  getBookingC: async (req, res) => {
    const sId = localStorage.getItem("bookingData");
    const uId = localStorage.getItem("userMail");
    const userData = await UserModels.getUser(uId);
    const serData = await UserModels.getService(sId);

    console.log(sId, userData, serData)
    res.render('pages/bookingservice', { uId,userData, serData })
  },
  getBooked: async (req, res) => {
    const uId = localStorage.getItem("userMail");
    const userData = await UserModels.getUser(uId);
    const userBooking = await UserModels.getUserBooking(uId);
    console.log(userBooking)
    res.render('pages/booked', { uId, userData, userBooking })
  },
  getUser: async (req, res) => {
    const allUser = await UserModels.getallUser()
    res.render('pages/user', {  allUser })
  },

  getWorker: async (req, res) => {
    const allWorker = await UserModels.getallWorker()
    console.log("allWorker", allWorker)
    res.render('pages/worker', { allWorker })
  },

  getWorkerDesh: async (req, res) => {
    const uId = localStorage.getItem("workerData");
    const workerData = await UserModels.workermailCatchM(uId);
    const allBooking = await UserModels.getallBooking()
    console.log(workerData)
    res.render('pages/workerdesh', { uId, allBooking,workerData })
  },

  bookData: async (req, res) => {
    try {
      const {
        service_id
      } = req.body;
      localStorage.setItem(`bookingData`, `${service_id}`);
      res.redirect('/bookingservice')

    } catch (e) {
      res.send('Somthing Wrong')
    }
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

  /* User login controller */
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
          if (user[0].status == 1) {



            console.log("pass ok", isValidPassword)

            localStorage.setItem('userMail', `${userMail}`)

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
              const uId = localStorage.getItem("userMail");
              const userData = await UserModels.getUser(uId)
              console.log({ userData })

              res.render('pages/home', { uId, allService, userData })
              // res.render('pages/login',{ title: 'Express', session: req.session })



              // res.redirect('/',{ user });
              console.log("endd................")
            }
          } else {
            res.send('Active your account.');
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
    }
  },

  /* Worker login controller */
  workerloginC: async (req, res) => {
    try {
      const {
        email, pass,
      } = req.body;

      if (email && pass) {
        const login = await UserModels.workermailCatchM(email);
        if (login.length > 0) {
          for (let i = 0; i < login.length; i++) {
            const validPass = await bcrypt.compare(pass, login[i].pass);
            if (validPass) {
              if (login[i].status == 1) {
                const userMail = login[0].email;

                localStorage.setItem(`workerData`, `${userMail}`)

                res.redirect('/workers');
              } else {
                res.send('Active your account.');
              }
            } else {
              res.send('Incorrect Password');
            }
          }
        } else {
          res.send('Incorrect Email Address');
        }
        res.end();
      } else {
        res.send('Please enter your email, password and role, If you have no account please sign up.')
        res.end();
      }
    } catch (e) {
      res.send('Wrong')
      // res.send(<script>alert("your alert message"); window.location.href = "/page_location"; </script>);
    }
  },

  /* ====== New User register  Controller  ====== */

  registerC: async (req, res) => {
    const uId = localStorage.getItem("userMail");
    const user = await UserModels.getUser(uId)

    res.render('pages/signup', { uId, user });
  },
  /* ====== New Worker register  Controller  ====== */
  workerRegisterC: async (req, res) => {
    const uId = localStorage.getItem("userMail");
    const user = await UserModels.getUser(uId)

    res.render('pages/workersignup', { uId, user });
  },

  // delet afer 
  registerCdemo: async (req, res) => {
    const uId = localStorage.getItem("userMail");
    const user = await UserModels.getUser(uId)

    res.render('pages/signupdemo', { uId, user });
  },
  /* ====== New login Controller  ====== */

  newlogin: async (req, res) => {
    const uId = localStorage.getItem("userMail");
    const user = await UserModels.getUser(uId)

    res.render('pages/login', { uId, user });
  },


  workerlogin: async (req, res) => {
    const uId = localStorage.getItem("userMail");
    const user = await UserModels.getUser(uId)
    res.render('pages/workerlogin', { uId, user });
  },

  adminLoginData: async (req, res) => {
    try {
      const {
        userid, pass,
      } = req.body;

      console.log("admin login =", userid, pass);
      if (userid && pass) {
        const alogin = await UserModels.getAdmin(userid);
        console.log("test", alogin)
        if (alogin.length > 0) {
          for (let i = 0; i < alogin.length; i++) {            
            if (pass==alogin[0].pass) {
              localStorage.setItem(`adminData`, `${userid}`);
              res.redirect('/admin');
            } else {
              res.send('Incorrect Password');
            }
          }
        } else {
          res.send('Incorrect User ID');
        }
        res.end();
      } else {
        res.send('Please enter your Id, password.')
        res.end();
      }
    } catch (e) {
      console.log(e);
      res.send('Wrong')
    }
  },



  /* ====== Profile Controller  ====== */
  profile: async (req, res) => {
    const uId = localStorage.getItem("userMail");
    const userData = await UserModels.getUser(uId)

    res.render('pages/userprofile', { uId, userData });
  },

  /* ====== Register controller ====== */
  insertRegisterC: async (req, res) => {
    const { firstName, lastName, gender, email, phone, propic, house, road, division, zila, upazila, pass } = req.body;
    const errors = validationResult(req).formatWith((error) => error.msg);
    const uId = localStorage.getItem("userMail");
    const user = await UserModels.getUser(uId)
    const images = req.files;
    propicFilename = images.propic[0].filename

   
    if (!errors.isEmpty()) {
      res.render('pages/signup', { uId, user });
      return res.render('pages/signup', {
        error: errors.mapped(),
        value: { firstName, lastName, gender, email, phone, propicFilename, house, road, division, zila, upazila, pass },
      });
    } try {
      const hashPassword = await bcrypt.hash(pass, 10);
      const registerData = await UserModels.insertRegisterM(
        firstName, lastName, gender, email, phone, propicFilename, house, road, division, zila, upazila, hashPassword
      );


      const toMail = "houseshiftingserviceanwara@gmail.com"
      const subject = 'House Shifting Service active account';
      const textMessage = 'House Shifting Service account verify'
      const link = `${process.env.BASE_UR}`
      console.log("before")
      const activeBtn = `
      <div style="padding: 0px 20px;margin-left: 8px;text-align: center;">
      <h4>Wellcome  ${firstName} ${lastName}.<h4>
      <p>If you are sinup for House Shifting Service.<p> <br>
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

      console.log('regis data', registerData);
      console.log("id", registerData[0].insertId)

      sendMail(email, subject, textMessage, activeBtn)
      res.redirect('/login')
    } catch (err) {
      console.log('register data Error');
      return res.render('pages/signup', { registerFail: true });
    }
  },

  /* ======Worker Register controller ====== */
  insertWorkerRegisterC: async (req, res) => {
    try {
      const { firstName, lastName, gender, email, phone, propic, nid1, nid2, house, road, division, zila, upazila, pass } = req.body;
      const images = req.files;
      propicFilename = images.propic[0].filename
      nid1Filename = images.nid1[0].filename
      nid2Filename = images.nid2[0].filename
    

      const hashPassword = await bcrypt.hash(pass, 10);

      const registerData = await UserModels.insertWorkerRegisterM(
        firstName, lastName, gender, email, phone, propicFilename, nid1Filename, nid2Filename, house, road, division, zila, upazila, hashPassword
      );
      console.log('register data ', registerData);
      // return res.render('pages/workersignup', { workerauth: true });
      res.redirect('/workerlogin')
    } catch (err) {
      console.log('register data not found');
      return res.render('pages/workersignup', { registerFail: true });
    }
  },

  /* ======Worker Register controller ====== */
  insertBooking: async (req, res) => {
    try {
      const { uId, userEmail, userPhone, currentAddress, desHouse, desRoad, desDivision, desZila, desUpazila, serId, serTitle, serPrice, serDate, paymentMathod, paymentProof } = req.body;
      const images = req.files;
      paymentProofFilename = images.paymentProof[0].filename

      console.log("Propic=", paymentProofFilename)

      const registerData = await UserModels.insertBooking(
        uId, userEmail, userPhone, currentAddress, desHouse, desRoad, desDivision, desZila, desUpazila, serId, serTitle, serPrice, serDate, paymentMathod, paymentProofFilename
      );
      res.redirect('/booked')
    } catch (err) {
      res.render('pages/bookingservice');
    }
  },


  /* ====== Logout Controller  ====== */
  logout: async (req, res) => {
    res.cookie(process.env.COOKIE_NAME, '', { maxAge, httpOnly: true, signed: true });
    localStorage.removeItem('userMail');
    res.redirect('/');
  },

  WorkerLogout: async (req, res) => {
    localStorage.removeItem('workerData');
    res.redirect('/workerlogin');
  },

  adminLogout: async (req, res) => {
    localStorage.removeItem('adminData');
    res.redirect('/admin');
  },

  accountVerify: async (req, res) => {
    const userId = req.params.id
    console.log({ userId })
    const isUpdate = await UserModels.updateStatus(userId)
    if (isUpdate.affectedRows) {
      res.redirect('/login')
    }
  },

  workerAccountVerify: async (req, res) => {
    const userId = req.params.id
    console.log({ userId })
    const isUpdate = await UserModels.workeracUpdateStatus(userId)
    if (isUpdate.affectedRows) {
      res.redirect('/worker')
    }
  },

  workerAccountHold: async (req, res) => {
    const userId = req.params.id
    console.log({ userId })
    const isUpdate = await UserModels.workerHoaldUpdateStatus(userId)
    if (isUpdate.affectedRows) {
      res.redirect('/worker')
    }
  },

  bookingVerify: async (req, res) => {
    const userId = req.params.id
    console.log({ userId })
    const isUpdate = await UserModels.bookingUpdateStatus(userId)
    if (isUpdate.affectedRows) {
      res.redirect('/booking')
    }
  },

  bookingHold: async (req, res) => {
    const userId = req.params.id
    console.log({ userId })
    const isUpdate = await UserModels.bookingHoaldUpdateStatus(userId)
    if (isUpdate.affectedRows) {
      res.redirect('/booking')
    }
  },

}
module.exports = UserController
