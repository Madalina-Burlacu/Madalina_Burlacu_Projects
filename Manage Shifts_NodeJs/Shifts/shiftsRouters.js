const express = require('express');
const router = express.Router();
const shiftsController = require('./shiftsController');
const userController = require('../Users/userController');
const extractId = require('../extractId');

// router.use(userController.protect);

// regular user
router.get('/getShiftById/:id', userController.protect, extractId, shiftsController.getShiftById);
router.get('/shiftsUserLogged', userController.protect, shiftsController.showShiftsOfUserLogged);
//router.get('/getShiftByShiftName', userController.protect, shiftsController.getShiftsByShiftName);
router.get('/statisticsUser', userController.protect, shiftsController.shiftsStatisticsUser);


router.patch('/updateShift/:id', userController.protect, extractId, shiftsController.updateShiftById);

router.post('/createShifts', userController.protect, extractId, shiftsController.createShifts);

// admin
router.delete('/deleteShift/:id', userController.protect, userController.permission, shiftsController.deleteShift);

router.get('/showAllShifts/:id?', userController.protect, userController.permission, shiftsController.showAllShifts);

router.get('/statisticsAdmin', userController.protect, userController.permission, shiftsController.shiftsStatisticsAdmin);


module.exports = router;