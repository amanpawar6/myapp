const usersModel = require('../model/userData');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 10;

const checkExistingUser = (req, res, next) => {
    usersModel.find({
        email: req.body.email
    }, (err, data) => {
        if (err) {
            return res.send(401, err)
        }
        if (data.length > 0) {
            return res.send(409, {
                message: "User Already Exists"
            })
        } else {
            next();
        }
    })
}

const passwordHash = (req, res, next) => {
    bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
        if (err) {
            return res.send(401, err)
        }
        delete req.body.password;
        req.body.password = hash;
        next();
    })
}

const valdidation = (req, res, next) => {
    if (!req.session.userId) {
        res.send(401, {
            message: "login first"
        });
    } else if (req.params.id === req.session.userId) {
        next()
    } else {
        res.send(401, {
            message: "Unauthorized"
        });
    }
}

const valdidationUserData = (req, res, next) => {
    if (!(req.body.name && req.body.email && req.body.password && req.body.age)) {
        res.send(400, {
            message: "Send proper Data"
        });
    } else {
        next()
    }
}

const validatingloginData = (req, res, next) => {
    if (!(req.body.email && req.body.password)) {
        res.send(400, {
            message: "Please provide email & password for login"
        });
    } else {
        next()
    }
}

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(token == null){ return res.send(401)};
    jwt.verify(token, 'shhhhh', (err, user) => {
        if(err) {return res.send(403)}
        if(req.params.id === user.id){
        req.user = user;
        next();
    }
    else {
        res.send(401, {
            message: "Unauthorized"
        });
    }
    })
}


module.exports = {
    checkExistingUser,
    passwordHash,
    valdidation,
    valdidationUserData,
    validatingloginData,
    authenticateToken,
}