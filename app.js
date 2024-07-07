const express = require('express');
const app = express();
const mongoose = require('mongoose');
const booksRoutes = require('./routes/books');
const userRoutes = require('./routes/user');
const path = require('path');
const dotenv = require('dotenv');
const Book = require('./models/book');

// Charger les variables d'environnement depuis le fichier .env
dotenv.config();

// Récupérer le mot de passe depuis les variables d'environnement
const password = process.env.MONGODB_PASSWORD;

mongoose.connect(`mongodb+srv://sam121110987654321:${password}@cluster16.vssydqk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster16`,
    { useNewUrlParser: true,
      useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));
    
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(express.json());

app.use('/api/books', booksRoutes);
app.use('/api/auth', userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;