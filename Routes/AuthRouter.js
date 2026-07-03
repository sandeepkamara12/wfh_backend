const { signup, login, changePassword, logout, subAdminsignup, upload  } = require('../Controllers/AuthController');
const { signupValidation, loginValidation } = require('../Middlewares/AuthValidation');
const { ensureAuthenticated, isTeacher } = require('../Middlewares/Auth');
const { updateUser } = require('../Controllers/User/UserController'); 
const router = require('express').Router();

router.post('/login', loginValidation, login);
// router.post('/signup', signup); 
router.post(
  '/signup',
  upload.single('file'),
  signup
);
router.post('/sub-admin-signup', subAdminsignup); 
router.post('/change-password/:id', ensureAuthenticated, changePassword);
router.post('/logout', logout);

module.exports = router;