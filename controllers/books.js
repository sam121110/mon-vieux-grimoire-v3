const Book = require('../models/book');
const fs = require('fs');
const sharp = require('sharp');

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

// redirection vers un livre spécifique
exports.getOneBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
        .then(book => res.status(200).json(book))
        .catch(error => res.status(404).json({ error }));
};

// enregistrer un nouveau livre
exports.createBook = (req, res, next) => {
    const bookObject = JSON.parse(req.body.book);
    delete bookObject._id;
    delete bookObject._userId;

    const book = new Book({
        ...bookObject,
        userId: req.auth.userId
    });

    const filename = `${req.file.filename.split('.')[0]}.webp`;
    const outputFilePath = `images/${filename}`;

    sharp(req.file.path)
        .resize({ width: 250, height: 250 }) 
        .toFormat('webp')
        .toFile(outputFilePath, (err, info) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            //Suppression du fichier original
            fs.unlink(req.file.path, (unlinkErr) => {
                if (unlinkErr) console.log(unlinkErr);
            });

            book.imageUrl = `${req.protocol}://${req.get('host')}/images/${filename}`;

            book.save()
                .then(() => res.status(201).json({ message: 'Objet enregistré !' }))
                .catch(error => res.status(400).json({ error }));
        });
};

// modification d'un livre
exports.updateBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
        .then(book => {
            if (book.userId != req.auth.userId) {
                return res.status(401).json({ message: 'Not authorized' });
            }

            const bookObject = req.file ?
            {
                ...JSON.parse(req.body.book),
                imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename.split('.')[0]}.webp`
            } : { ...req.body };

            if (req.file) {
                // Supprimer l'ancienne image si une nouvelle est téléchargée
                const oldFilename = book.imageUrl.split('/images/')[1];
                fs.unlink(`images/${oldFilename}`, (err) => {
                    if (err) console.log(err);
                });

                const filename = `${req.file.filename.split('.')[0]}.webp`;
                const outputFilePath = `images/${filename}`;

                sharp(req.file.path)
                    .resize({ width: 250, height: 250 }) 
                    .toFormat('webp')
                    .toFile(outputFilePath, (err, info) => {
                        if (err) {
                            return res.status(500).json({ error: err.message });
                        }

                        // Suppression du fichier original
                        fs.unlink(req.file.path, (unlinkErr) => {
                            if (unlinkErr) console.log(unlinkErr);
                        });

                        bookObject.imageUrl = `${req.protocol}://${req.get('host')}/images/${filename}`;

                        Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id })
                            .then(() => res.status(200).json({ message: 'Objet modifié !' }))
                            .catch(error => res.status(400).json({ error }));
                    });
            } else {
                Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Objet modifié !' }))
                    .catch(error => res.status(400).json({ error }));
            }
        })
        .catch(error => res.status(400).json({ error }));
};

// suppression d'un livre
exports.deleteBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
        .then(book => {
            if (book.userId != req.auth.userId) {
                res.status(401).json({ message: 'Non autorisé!' });
            } else {
                const filename = book.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Book.deleteOne({ _id: req.params.id })
                        .then(() => res.status(200).json({ message: 'Objet supprimé !' }))
                        .catch(error => res.status(401).json({ error }));
                });
            }
        })
        .catch(error => res.status(500).json({ error }));
};

// Ajouter une notation à un livre
exports.addRating = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
        .then(book => {
            if (!book) {
                return res.status(404).json({ message: 'Livre non trouvé!' });
            }

            const userId = req.auth.userId;
            const rating = req.body.rating;

            // Vérifier si l'utilisateur a déjà noté ce livre
            const existingRating = book.ratings.find(r => r.userId === userId);
            if (existingRating) {
                return res.status(400).json({ message: 'Livre déjà noté!' });
            }

            // Ajouter la nouvelle notation
            book.ratings.push({ userId, rating });

            // Calculer la nouvelle moyenne des notes
            const totalRatings = book.ratings.reduce((acc, r) => acc + r.rating, 0);
            book.averageRating = totalRatings / book.ratings.length;

            // Sauvegarder le livre avec la nouvelle notation
            book.save()
                .then(() => res.status(200).json({ message: 'Note ajoutée avec succès!' }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

// Obtenir les 3 livres avec la meilleure note moyenne
exports.getBestRatedBooks = (req, res, next) => {
    Book.find().sort({ averageRating: -1 }).limit(3)
        .then(books => {
            res.status(200).json(books);
        })
        .catch(error => res.status(500).json({ error }));
};

