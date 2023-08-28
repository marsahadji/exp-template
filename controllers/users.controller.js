const UserModel = require('../models/users.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const {validationResult} = require('express-validator');

const createUser = async function (req, res, next) {

    // Gérer les erreurs de validation spécifiques
    let errorArray = [];
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      errors.array().forEach((element) => {
        errorArray.push(element.path + " : " + element.msg);
      });

      return res.status(400).json({
        message: "veuillez corriger les erreurs suivantes",
        errors: errorArray, 
        success: false,
      });

    }

    //verification de présence avant création

    const { phone, email } = req.body; 
      try {
        // Check if a user with the provided phone number or email already exists
        const existingUser = await UserModel.findOne({

           $or: [ { phone: phone }, 
            {$and : [ { email: email}, { email: { $ne: null } } ] }] 

        });

        if (existingUser) {
          return res.status(409).json({succes : false, message: 'Un utilisateur avec ce numéro de téléphone ou email existe déjà.' });
        }
      }
      catch (error) {
        return res.status(500).json({succes: false, message: 'Une erreur s\'est produite lors de la recherche de l\'utilisateur.' });
      }

    // verification du role du créateur


    // enregister l'utilisateur
    let userItem = new UserModel({
    nom: req.body.nom,
    email: req.body.email,
    role: req.body.role,
    titre: req.body.titre,
    prenoms: req.body.prenoms,
    phone: req.body.phone,
    avatar: req.body.avatar
    });

      userItem.save().then(data => {
        res.status(200).json({ status: "success", message: "Utilisateur ajouté avec succès !!!", data });
      })
      .catch(err => {
        next(err);
      });
  
};


const getUser = async function (req, res, next) {

  // Get the user ID from the params
  const userId = req.params.id;

  // Check if the user ID exists
  const userx = await UserModel.findOne({ _id : userId });
  if (!userx) {
   
    return res.status(404).json({succes : false, message: "Utilisateur non trouvé !!" });

  }

  // Return the user in JSON format
  res.status(200).json({succes : true, message: "Informations de l'utilisateur !!", user : userx});
};


const getAllUsers = async function (req, res, next) {
    try {
      const { role } = req.query;
  
      // Create a filter object to pass to the find() function
      const filterObject = {};
  
      // If the 'filter' parameter is provided, use it to filter the users
      if (role) {
        filterObject.role = role;
      }

      // Get all users based on the filter
      const users = await UserModel.find(filterObject).select("-password -__v");
  
      // Return the users in JSON format
      return res.status(200).json({
        success: true,
        message: "Liste des utilisateurs",
        users: users,
      });
    } catch (error) {
      next(error); // Pass any errors to the error handling middleware
    }
};

const modifyProfile = async function (req, res, next) {

      try {
        const { nom, titre, prenoms, avatar } = req.body;
    
       
        const userId = req.userId; 
        const user = await UserModel.findById(userId);
    
        // If the user does not exist, return an error
        if (!user) {
          return res.status(404).json({
            success: false,
            message: "User not found.",
          });
        }
    
        // Update the user's profile with the provided data
        if (nom) {
          user.nom = nom;
        }
        if (titre) {
          user.titre = titre;
        }
        if (prenoms) {
          user.prenoms = prenoms;
        }
        if (avatar) {
          user.avatar = avatar;
        }
    
        // Save the updated user profile
        await user.save();
    
        // Return the updated user in JSON format
        res.status(200).json({
          success: true,
          message: "Profile Mis à jour !!.",
          user: user,
        });
      } catch (error) {
        next(error); // Pass any errors to the error handling middleware
      }
};


const deleteAccount = async function (req, res, next) {
  try {
    
    const userId = req.params.id; 
    const user = await UserModel.findById(userId);

    // If the user does not exist, return an error
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Compte non trouvé.",
      });
    }

    // Check if the user has the 'superadmin' role
    if (user.role === "superadmin") {
      return res.status(403).json({
        success: false,
        message: "Superadmin accounts cannot be deleted.",
      });
    }

    // Proceed with deleting the user account
    await UserModel.findByIdAndDelete(userId);

    // Return a success response
    res.status(200).json({
      success: true,
      message: "Compte Supprimé.",
    });
  } catch (error) {
    next(error); // Pass any errors to the error handling middleware
  }
};
    
module.exports = {createUser, getUser, getAllUsers, modifyProfile, deleteAccount};