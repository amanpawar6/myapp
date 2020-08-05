var express = require('express');
var router = express.Router();
var modules = require('../modules/registrationModules');
 

router.post('/Registration', modules.checkExistingUser ,modules.postData);

router.get('/Login', modules.getData);

router.put('/:id', modules.valdidation , modules.putData);

router.patch('/:id', modules.valdidation , modules.patchData);

router.delete('/:id', modules.valdidation , modules.deleteData);


module.exports = router;