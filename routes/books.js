const express = require('express');

// Création d'un routeur
const router = express.Router();
const auth = require('../middleware/auth');

// bibliothèque middleware pour faciliter la gestion des téléchargements de fichiers
const multer = require('../middleware/multer-config');
const booksCtrl = require('../controllers/books');

router.get('/bestrating', booksCtrl.getBestRatedBooks);
router.get('/', booksCtrl.getAllBooks);
router.get('/:id', booksCtrl.getOneBook);
router.post('/', auth, multer, booksCtrl.createBook);
router.put('/:id', auth, multer, booksCtrl.updateBook);
router.delete('/:id', auth, booksCtrl.deleteBook);
router.post('/:id/rating', auth, booksCtrl.addRating);

module.exports = router;