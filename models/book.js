const mongoose = require('mongoose');

// Création d'un schéma de données
const bookSchema = mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  imageUrl: { type: String, required: true },
  year: { type: Number, required: true },
  genre: { type: String, required: true },
  ratings: [
    { 
    userId: { type: String, required: true },
    grade: { type: Number, required: true }, 
    }
  ],
  averageRating: { type: Number, required: true },
});

// La méthode model transforme ce modèle en un modèle utilisable
module.exports = mongoose.model('Book', bookSchema);