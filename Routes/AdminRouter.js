const { ensureAuthenticated, isAdmin } = require('../Middlewares/Auth');
const { userData, getUserById, updateUserById, deleteUserById, activeDeactiveUser, adminprofile, updateAdminUser } = require('../Controllers/Admin/UserController'); 




const router = require('express').Router();
 
router.get('/all-users', ensureAuthenticated, isAdmin, userData);
router.get('/user/:id', ensureAuthenticated, isAdmin, getUserById);
router.post('/user/update/:id', ensureAuthenticated, isAdmin, updateUserById);
router.post('/user/delete/:id', ensureAuthenticated, isAdmin, deleteUserById);
router.post('/user/status/:id', ensureAuthenticated, isAdmin, activeDeactiveUser);



router.get('/admin-profile/:id', ensureAuthenticated, isAdmin, adminprofile);   
 





router.post('/update-admin/:id', ensureAuthenticated, isAdmin, updateAdminUser);



module.exports = router; 