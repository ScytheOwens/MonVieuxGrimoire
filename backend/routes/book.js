const express = require('express');
const router = express.Router();

const bookCtrl = require('../controllers/book');

router.post('/', bookCtrl.createBook);
router.get('/', bookCtrl.findBooks);
router.get('/:id', bookCtrl.findBookById);
router.put('/:id', bookCtrl.updateBook);
router.delete('/:id', bookCtrl.deleteBook);

module.exports = router;
