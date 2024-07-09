// Importation de Mongoose pour faciliter l'interaction avec MongoDB
const mongoose = require('mongoose');

// améliore les messages d'erreur lors de l'enregistrement de données uniques
const uniqueValidator = require('mongoose-unique-validator');

// La méthode Schema de Mongoose permet de créer un schéma de données
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

// Plugin pour gérer la validation d'unicité des champs
userSchema.plugin(uniqueValidator);

// La méthode model transforme ce modèle en un modèle utilisable
module.exports = mongoose.model('User', userSchema);