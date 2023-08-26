// validation.js
const express = require('express');
const { body, validationResult } = require('express-validator');

 let registerValidator = [
   body('nom').notEmpty().withMessage('Le nom est requis'),
   body('prenoms').notEmpty().withMessage('Les prénoms sont requis'),
   body('email').isEmail().withMessage('Veuillez entrer une adresse e-mail valide'),
   body('phone').isMobilePhone().withMessage('Veuillez entrer un numéro de téléphone valide'),
   body('role').notEmpty().withMessage('Veuillez spécifier un rôle')
   .isIn(['admin',, 'client']).
   withMessage('Le rôle doit être parmi les choix suivants : admin, client'),
 ];
   

module.exports = {registerValidator};