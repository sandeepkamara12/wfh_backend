const { ensureAuthenticated, isSubadmin } = require('../Middlewares/Auth');
const { userData, getUserById, updateUserById, deleteUserById, activeDeactiveUser, adminprofile, updateAdminUser } = require('../Controllers/SubAdmin/UserController'); 
const { createClassroom, getClassrooms, getClassroomById, updateClassroom, deleteClassroom, } = require("../Controllers/SubAdmin/ClassroomController");
const { createSection, getSections, getSectionById, updateSection, deleteSection, } = require("../Controllers/SubAdmin/SectionController");



const router = require('express').Router();
 
router.get('/all-users', ensureAuthenticated, isSubadmin, userData);
router.get('/user/:id', ensureAuthenticated, isSubadmin, getUserById);
router.post('/user/update/:id', ensureAuthenticated, isSubadmin, updateUserById);
router.post('/user/delete/:id', ensureAuthenticated, isSubadmin, deleteUserById);
router.post('/user/status/:id', ensureAuthenticated, isSubadmin, activeDeactiveUser);
router.get('/admin-profile/:id', ensureAuthenticated, isSubadmin, adminprofile);   
router.post('/update-admin/:id', ensureAuthenticated, isSubadmin, updateAdminUser);
// classroom
router.post("/classroom/create",ensureAuthenticated, isSubadmin, createClassroom);
router.get("/classroom/", ensureAuthenticated, isSubadmin, getClassrooms);
router.get("/classroom/:id", ensureAuthenticated, isSubadmin, getClassroomById);
router.put("/classroom/:id", ensureAuthenticated, isSubadmin, updateClassroom);
router.delete("/classroom/:id", ensureAuthenticated, isSubadmin, deleteClassroom);
// secton
router.post("/section/create",ensureAuthenticated, isSubadmin, createSection);
router.get("/section/", ensureAuthenticated, isSubadmin, getSections);
router.get("/section/:id", ensureAuthenticated, isSubadmin, getSectionById);
router.put("/section/:id", ensureAuthenticated, isSubadmin, updateSection);
router.delete("/section/:id", ensureAuthenticated, isSubadmin, deleteSection);



module.exports = router; 