const mongoose = require('mongoose');

//Define a schema
const Schema = mongoose.Schema;

// Model for opt codes
const OtpModel = new Schema({
    code: {
      type: String,
      required: true,
      unique: true,
    },
    
    phone : {
      type: String,
      required: true,
    },

    count : {
      type: Number,
      default : 0,
    }

  }, 
      {
        timestamps : true,
      }
  );
  
  module.exports = mongoose.model('Otps', OtpModel);
  