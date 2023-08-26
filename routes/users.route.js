const express = require('express');
const router = express.Router();
const userController = require('../controllers/users.controller');
const validationsArray = require('../validations/users.validators');
const { check, validationResult } = require('express-validator');
const authJwt = require('../middlewares/authJwt');

router.post('/register', authJwt.isSuperAdmin, validationsArray.registerValidator, userController.createUser);

router.get('/getUser/:id', authJwt.isSuperAdminOrUser, userController.getUser);

router.get('/userList', authJwt.isSuperAdmin, userController.getAllUsers);

router.put('/updateProfil', authJwt.isSuperAdminOrUser, userController.modifyProfile);

router.delete('/deleteAccount/:id', authJwt.isSuperAdmin, userController.deleteAccount);


module.exports = router;

