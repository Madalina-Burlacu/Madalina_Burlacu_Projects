const express = require('express');
const userController = require('./userController');
const router = express.Router();

// regular user

// router.get('/email', userController.getUserByEmail);

router.post('/sign-up', userController.signup);
router.post('/login', userController.login);
router.post('/forgotPassword', userController.forgotPassword);


router.patch('/updateUserInfo', userController.protect, userController.updateUserInfo);
router.patch('/updatePassword', userController.protect, userController.updatePassword);
router.patch('/resetpassword/:token', userController.resetpassword);


//admin
router.get('/:id', userController.protect, userController.permission, userController.getUserById);
router.get('',userController.protect, userController.permission, userController.showallusers);
router.get('/getUserByEmail/:email', userController.protect, userController.permission, userController.getUserByEmail);

router.delete('/delete/:id', userController.protect, userController.permission, userController.deleteUserById);

router.patch('/:id', userController.protect, userController.permission, userController.updateUserByAdmin);


module.exports = router;