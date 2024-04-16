const express = require('express');
const router = express.Router();
const commentsController = require('./commentsController');
const userController = require('../Users/userController');
const extractId = require('../extractId');


//user
router.get('/getCommentById/:id', userController.protect, extractId, commentsController.getCommentById);
router.get('/commentsUserLogged', userController.protect, commentsController.getAllCommentsOfUserLogged);

router.patch('/:id', userController.protect, extractId, commentsController.updateCommentById);

router.post('/createComment', userController.protect, extractId, commentsController.createComment);

//admin
router.get('/allComments', userController.protect, userController.permission, commentsController.getAllCommentsForAdmin);
router.delete('/deleteComment/:id', userController.protect, userController.permission, commentsController.deteleCommentByAdmin);

module.exports = router;
