const Book = require('../models/book');

// afficher tous les livres
exports.getAllBooks = (req, res, next) => {
    Book.find()
        .then(books => {
            res.status(200).json(books);
        })
        .catch(error => {
            res.status(500).json({ message: 'Fetching books failed!' });
        });
};