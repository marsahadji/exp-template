const express = require('express');
const router = express.Router();
const authRouter = require('./auth.route');
const authJwt = require('../middlewares/authJwt');
const usersRouter = require('./users.route');


//authenfication
router.use('/auth', authRouter);

//utilisateurs
router.use('/users', authJwt.verifyToken, usersRouter);



module.exports = router;