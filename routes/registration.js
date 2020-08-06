var express = require('express');
var router = express.Router();
var modules = require('../modules/registrationModules');
var middlewares = require('../modules/middlewares');
 

router.post('/registration', middlewares.valdidationUserData, middlewares.checkExistingUser , middlewares.passwordHash , modules.postData);

router.post('/login', middlewares.validatingloginData, modules.userLogin);

router.put('/:id', middlewares.authenticateToken, middlewares.valdidation, middlewares.valdidationUserData, middlewares.passwordHash, modules.putData);

router.patch('/:id', middlewares.authenticateToken, middlewares.valdidation , modules.patchData);

router.delete('/:id', middlewares.authenticateToken, middlewares.valdidation , modules.deleteData);


module.exports = router;