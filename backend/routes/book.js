const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const sharp = require("../middleware/sharp-config");

const bookCtrl = require('../controllers/book');

router.post('/', auth, multer, sharp, bookCtrl.createBook);
router.get('/', bookCtrl.findBooks);
router.get('/bestrating', bookCtrl.findBestRatedBooks);
router.get('/:id', bookCtrl.findBookById);
router.put('/:id', auth, multer, sharp, bookCtrl.updateBook);
router.delete('/:id', auth, bookCtrl.deleteBook);
router.post('/:id/rating', auth, bookCtrl.rateBook);

module.exports = router;
