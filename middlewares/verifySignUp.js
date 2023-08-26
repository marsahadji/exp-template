const User = require('../models/users.model');


checkDuplicateUsername = (req, res, next) => {
  // Username
  User.findOne({
    where: {
      phone: req.body.phone
    }
  }).then(user => {
    if (user) {
      res.status(400).send({
        message: "Un utilisateur avec ce numéro de téléphone existe déjà."
      });
      return;
    }

    // Email
    User.findOne({
      where: {
        email: req.body.email
      }
    }).then(user => {
      if (user) {
        res.status(400).send({
          message: "Un utilisateur avec cet email existe déjà."
        });
        return;
      }

      next();
    });
  });
};


const verifySignUp = {
    checkDuplicateUsername: checkDuplicateUsername 
};

module.exports = verifySignUp;