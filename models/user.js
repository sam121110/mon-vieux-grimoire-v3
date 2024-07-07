const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// La méthode Schema de Mongoose permet de créer un schéma de données
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator);

// La méthode model transforme ce modèle en un modèle utilisable
module.exports = mongoose.model('User', userSchema);