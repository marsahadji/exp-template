const axios = require("axios");

const providerD7 = { 
  name : 'D7 Networks', 
  url : 'https://rest-api.d7networks.com/secure/send',
  headers : {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: process.env.D7_AUTH_KEY,
    }
};

 const sendSMS = async function(receiverPhone, message,) {

  provider = providerD7;

  const data = JSON.stringify({
    to: receiverPhone,
    content: message,
    from: "CSS - OTP",
  });

    const config = { method: 'post', url: provider.url, headers: provider.headers, data };
    const response = await axios(config);
    return response;
};

module.exports = {sendSMS};

