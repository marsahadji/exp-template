const mongoose = require('mongoose');

//Define a schema
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    nom: {
        type: String,
        trim: true,
        required: true,
    },
    prenoms: {
        type: String,
        trim: true,
        required: true,
    },
    phone: {
        type: String,
        trim: true,
        required: true,
    },
    email: {
        type: String,
        trim: true,
    },
    role : {
        type: String,
        enum : ["client", "admin", "superadmin"],
        required : true,
    },

    lastLogin : {
        type : Date,
    },

    avatar: {
        type: String,
    },

}, {
    timestamps :true,
});

module.exports = mongoose.model('Users', UserSchema);
