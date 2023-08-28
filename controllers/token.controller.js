const TokenModel = require('../models/token.model');

const saveOrUpdateToken = async function(userx, tokenx) {

    const tokenExist = await TokenModel.findOne({user : userx.id});

    if (!tokenExist){
        const tokenItem = new TokenModel({
            token : tokenx,
            user : userx._id,
            expiresAt : new Date(new Date().getTime() + 60000)
        });

        tokenItem.save();
    }

    else {
            TokenModel.findOneAndUpdate({user : userx._id}, {
                token : tokenx,
                expiresAt : new Date(new Date().getTime() + 60000)
            });
    }
};

module.exports = {saveOrUpdateToken};