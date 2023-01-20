const router = require('express').Router();

const UserController = require('../controllers/UserController');

const multer = require('multer');

const upload = multer({ dest: 'public/uploads/' });


/* ======== import files ========= */
const {
  requireAuth,
  checkCurrentLogin,
  redirectLoggedIn,
} = require('../middleware/AuthMiddleware');
const { singupValidator, loginValidator } = require('../middleware/validator/userValidator');
const decorateHtmlResponse = require('../middleware/decorateHtmlResponse');

//post data

router.post('/add-service', UserController.serviceData)


// //get data
router.get('/', UserController.getHome)
router.get('/demosignup', UserController.registerCdemo)
router.get('/home', UserController.getHome)

router.get('/about', UserController.getAbout)
router.get('/contact', UserController.getContact)
router.get('/offer', UserController.getOffer)
router.get('/services', UserController.getServices)


router.get('/admin', UserController.getAdmin)
router.get('/booking', UserController.getBooking)
router.get('/bookingservice', UserController.getBookingC)

router.get('/booked', UserController.getBooked)
router.get('/user', UserController.getUser)
router.get('/worker', UserController.getWorker)
router.get('/workers', UserController.getWorkerDesh)
router.get('/service', UserController.getServiceData)
router.post('/book-service', UserController.bookData)


// router.get('/service', UserController.getService)


// test
/* ======= Get Routes ======= */
router.get(
  '/login',
  decorateHtmlResponse('Home'), redirectLoggedIn,

  UserController.newlogin,
);

router.get(
  '/workerlogin', UserController.workerlogin,
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

router.get(
  '/workersignup',
  decorateHtmlResponse('SignUp'),
  UserController.workerRegisterC,
);

router.get('/logout', UserController.logout);
router.get('/workerlogout', UserController.WorkerLogout);
router.get('/adminlogout', UserController.adminLogout);


router.post('/alogin', UserController.adminLoginData)

/* ======= Post routes ======== */
router.post(
  '/signup', upload.fields([{ name: 'propic' }]),
  decorateHtmlResponse('SignUp'),
  singupValidator,
  UserController.insertRegisterC,
);

router.post(
  '/workersignup', upload.fields([{ name: 'propic' },
   { name: 'nid1' }, 
   { name: 'nid2' }]),
  UserController.insertWorkerRegisterC,
);

router.post('/login', decorateHtmlResponse('Login'), UserController.loginC)
router.post('/workerlogin',  UserController.workerloginC)

router.get('/verify-account/:id', UserController.accountVerify)
router.get('/verify-worker-account/:id', UserController.workerAccountVerify)
router.get('/hold-worker-account/:id', UserController.workerAccountHold)
router.get('/verify-booking/:id', UserController.bookingVerify)
router.get('/hold-booking/:id', UserController.bookingHold)

router.post(
  '/bookingservice', upload.fields([{ name: 'paymentProof' }]),
  UserController.insertBooking,
);


// 



module.exports = router;
