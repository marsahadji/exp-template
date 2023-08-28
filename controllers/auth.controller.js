const jwt = require("jsonwebtoken");
const User = require('../models/users.model');
const OtpModel = require('../models/otp.model');

const OtpManager = require('./otp.controller');
const TokenController = require('./token.controller');

const login = async function (req, res, next){

    const { username, logintype } = req.body;

    const user = await User.findOne({  $or: [
        { email: username },
        { phone: username }, ] });

    if (!user) {
      return res.status(401).json({error : true, message: "Identifiant inexistant ou incorrect !!" });
    }

    OtpManager.checkAndSendOTP(user, logintype);

    return res.status(200).json({succes : true, message: "Code envoyé !! "});

};

const verifyCode = async function (req, res, next) {

    const username = req.body.username;
    const codex = req.body.code;

    const user = await User.findOne({  $or: [
        { email: username },
        { phone: username }, ] });

    if (!user) {
      return res.status(401).json({error : true, message: "Identifiant inexistant ou incorrect !!" });
    }

    const checkOTP = await OtpModel.findOne({phone : user.phone, code : codex});

    if (!checkOTP){
        return res.status(401).json({error : true, message: "Identifiant / Code inexistant ou incorrect !!" });
    }

    const tokenx = jwt.sign({id : user._id}, process.env.JWT_SECRET, {expiresIn : '1h'});


    TokenController.saveOrUpdateToken(user, tokenx);

    const deleted = await OtpModel.findOneAndDelete({_id : checkOTP._id});

    user.lastLogin = new Date();

    user.save();

    return res.status(200).json({succes : true, message : "Connexon établie !!", 
    token : {
        acces_token : tokenx,
        expiresAt : new Date(new Date().getTime() + 60 * 60 * 1000)
    }});

};

module.exports = {login, verifyCode};
