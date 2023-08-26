const jwt = require("jsonwebtoken");
const User = require("../models/users.model");

const verifyToken = (req, res, next) => {

  let token = req.headers.authorization.split(' ')[1];

  if (!token) {
    return res.status(401).send({
      message: "Authentification requise !!"
    });
  }

  jwt.verify(token, process.env.JWT_SECRET,
            (err, decoded) => {
              if (err) {
                return res.status(401).send({
                  message: "Authentification requise !!",
                });

              }
              req.userId = decoded.id;
              next();
            });
};

// superadmin
const isSuperAdmin = async (req, res, next) => {

  const user = await User.findOne( {_id : req.userId} )

      if (user.role === "superadmin") {
          next();
       }
       else 
       {
        return res.status(403).send({succes : false, 
          message: "Vous n'êtes pas autorisé à  acceder à  cette ressource !!" });
       }
     
};

// superadmin or self user
const isSuperAdminOrUser = async (req, res, next) => {

  const user = await User.findOne( {_id : req.userId} )

      if (user.role === "superadmin" || req.userId === req.params.id) {
          next();
       }
       else 
       {
        return res.status(403).send({succes : false, 
          message: "Vous n'êtes pas autorisé à  acceder à  cette ressource !!" });
       }  
};


module.exports = {
  verifyToken, isSuperAdmin, isSuperAdminOrUser
};