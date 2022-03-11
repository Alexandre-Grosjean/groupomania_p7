const multer = require('multer');
const path = require('path');

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {

        if (file.fieldname === 'imagePost') {
            cb(null, './images/posts');
            console.log('img post enregistré')
        } else if (file.fieldname === 'imageProfil') {
            cb(null, './images/profils');
            console.log('img profil enregistré')
        }
    },

    filename: function (req, file, cb) {
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        cb(null, name + Date.now() + '.' + extension);
    }
});

let upload = multer({ storage: storage })

module.exports = upload;