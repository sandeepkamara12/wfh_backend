// const { ensureAuthenticated, isSubadmin } = require('../Middlewares/Auth');
// const { userData, getUserById, updateUserById, deleteUserById, activeDeactiveUser, adminprofile, updateAdminUser } = require('../Controllers/Admin/UserController'); 
// const { createClassroom, getClassrooms, getClassroomById, updateClassroom, deleteClassroom, } = require("../../Controllers/Admin/ClassroomController");



 const router = require('express').Router();
 
// router.get('/all-users', ensureAuthenticated, isSubadmin, userData);
// router.get('/user/:id', ensureAuthenticated, isSubadmin, getUserById);
// router.post('/user/update/:id', ensureAuthenticated, isSubadmin, updateUserById);
// router.post('/user/delete/:id', ensureAuthenticated, isSubadmin, deleteUserById);
// router.post('/user/status/:id', ensureAuthenticated, isSubadmin, activeDeactiveUser);
// router.get('/admin-profile/:id', ensureAuthenticated, isSubadmin, adminprofile);   
// router.post('/update-admin/:id', ensureAuthenticated, isSubadmin, updateAdminUser);
// // classroom
// router.post("/create",ensureAuthenticated, isSubadmin, createClassroom);
// router.get("/", ensureAuthenticated, isSubadmin, getClassrooms);
// router.get("/:id", ensureAuthenticated, isSubadmin, getClassroomById);
// router.put("/:id", ensureAuthenticated, isSubadmin, updateClassroom);
// router.delete("/:id", ensureAuthenticated, isSubadmin, deleteClassroom);



module.exports = router; 