
const { ensureAuthenticated, isTeacher } = require('../Middlewares/Auth');
const { updateUser } = require('../Controllers/User/UserController'); 
const router = require('express').Router();

router.post('/profile-update', ensureAuthenticated,isTeacher, updateUser);
module.exports = router; 
