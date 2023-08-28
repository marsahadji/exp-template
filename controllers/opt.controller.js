const UserModel = require('../models/users.model');
const OtpModel = require('../models/otp.model');
const transporter = require('../config/mail');
const smsMan = require('../config/d7.sms');

const generateOTP = (length) => {

    var digits = "0123456789";
    let otpValue = "";
    for (let i = 0; i < length; i++) {
      otpValue += digits[Math.floor(Math.random() * 10)];
    }
    return otpValue;

};

const checkAndSendOTP = async function (user, logintype) {

    const codex = generateOTP(4);

    const existingOTP = await OtpModel.findOne({phone : user.phone});

    if(!existingOTP){

        let newOtp = new OtpModel({
            code : codex,
            phone : user.phone,
        });
        
        newOtp.save();

        sendOTP(codex, logintype, user._id);

        return;
    }

    const result = await OtpModel.findOneAndUpdate({phone : user.phone}, {code : codex});

    sendOTP(codex, logintype, user);
  
};
  
const sendOTP = async function (code, type, user ) {

    console.log('sending here !!' + code);


    if (type == 'mail'){

      try {
            const info = await transporter.sendMail({
            from: process.env.APP_MAIL, // sender address
            to: user.email,  // list of receivers
            subject: process.env.APP_NAME + "- Code de Vérification ", // Subject line
            text: `${process.env.APP_NAME} \nVoici votre code de vérification : "` + code, // plain text body
          });
      
        console.log("Message sent: %s", info.messageId);
      } catch (error) {
        console.log(error);
      }
    }

    if (type == 'phone'){

      try {

        const text = process.env.APP_NAME + ` \nVoici votre code de vérification : ` + code ;

        const info = await smsMan.sendSMS(user.phone, text);
      
        console.log("Message sent: %s", info);

      } catch (error) {
        console.log(error);
      }
    }
};

module.exports = {generateOTP, sendOTP, checkAndSendOTP};