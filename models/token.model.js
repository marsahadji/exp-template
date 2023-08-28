const mongoose = require('mongoose');

  // Model for JWT access tokens
  const JWTTokenSchema = new mongoose.Schema({
    
    token: {
      type: String,
      required: true,
      unique: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    expiresAt: {
      type: Date,
    },
  },
  {
    timestamps : true,
  });
  
  module.exports =  mongoose.model('Tokens', JWTTokenSchema);