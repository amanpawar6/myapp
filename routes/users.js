var express = require('express');
var router = express.Router();
var modules = require('../modules/dbModules');


router.get('/', modules.allData);

// router.get('/:id', modules.getById);

router.post('/', modules.postData);

router.put('/:id', modules.putData);

router.delete('/:id', modules.deletedata);

// router.get('/:id/books', modules.getBybookId);

// router.post('/:id/books', modules.bookValidation, modules.createBook);

// router.put('/:id/books/:bookid', modules.validation, modules.bookExists, modules.updateBook);

// router.delete('/:id/books/:bookid',modules.validation, modules.bookExists, modules.deletebook);

module.exports = router;
