const multer = require('multer');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

const storage = multer.diskStorage({
// fonction destination qui enregistre les fichiers dans le dossier images
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
// fonction filename utilise le nom d'origine, remplace les espaces par des underscores et ajoute un timestamp Date.now() comme nom de fichier
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension);
  }
});

module.exports = multer({storage: storage}).single('image');