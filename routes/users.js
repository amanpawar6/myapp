var express = require('express');
var router = express.Router();
var modules = require('./modules');

router.get('/', modules.allData);

router.get('/:id', modules.getById);

router.post('/', modules.userValidation, modules.postData);

router.put('/:id', modules.userExists, modules.putData);

router.delete('/:id', modules.userExists, modules.deleteData);

router.get('/:id/books', modules.getBybookId);

router.post('/:id/books', modules.bookValidation, modules.createBook);

router.put('/:id/books/:bookid', modules.validation, modules.bookExists, modules.updateBook);

router.delete('/:id/books/:bookid',modules.validation, modules.bookExists, modules.deletebook);

module.exports = router;
