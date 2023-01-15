const router = require('express').Router();
const UserController = require('../controllers/UserController');

/* ======== import files ========= */
const {
    requireAuth,
    checkCurrentLogin,
    redirectLoggedIn,
  } = require('../middleware/AuthMiddleware');
  const { singupValidator, loginValidator } = require('../middleware/validator/userValidator');
  const decorateHtmlResponse = require('../middleware/decorateHtmlResponse');

//post data
// router.post('/add-user', UserController.signupData)
router.post('/add-service', UserController.serviceData)
// // router.post('/login', UserController.loginData)

// //get data
router.get('/', UserController.getHome)
// router.get('/login', UserController.getloginForm)
// router.get('/signup', UserController.getSignupForm)
router.get('/demosignup', UserController.registerCdemo)
router.get('/home', UserController.getHome)

router.get('/about', UserController.getAbout)
router.get('/contact', UserController.getContact)
router.get('/offer', UserController.getOffer)
router.get('/services', UserController.getServices)

// router.get('/logout', UserController.getlogout)

router.get('/admin', UserController.getAdmin)
router.get('/booking', UserController.getBooking)
router.get('/booked', UserController.getBooked)
router.get('/user', UserController.getUser)
router.get('/worker', UserController.getWorker)
router.get('/workers', UserController.getWorkerDesh)
router.get('/service', UserController.getServiceData)

// router.get('/service', UserController.getService)


// test
/* ======= Get Routes ======= */
router.get(
    '/login',
    decorateHtmlResponse('Home'),redirectLoggedIn,
    
    UserController.newlogin,
  );
  router.get(
    '/profile',
    decorateHtmlResponse('Profile'),
    UserController.profile,
  );
  router.get(
    '/signup',
    decorateHtmlResponse('SignUp'),
    checkCurrentLogin,
    UserController.registerC,
  );
  router.get('/logout', UserController.logout);
  
  /* ======= Post routes ======== */
  router.post(
    '/signup',
    decorateHtmlResponse('SignUp'),
    singupValidator,
    UserController.insertRegisterC,
  );
  
  router.post('/login', decorateHtmlResponse('Login'),  UserController.loginC)

  router.get('/verify-account/:id', UserController.accountVerify)
  
// 



module.exports = router;
