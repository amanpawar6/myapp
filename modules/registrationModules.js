const usersModel = require('../model/userData');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10;

function postData(req, res, next) {
    var user1 = new usersModel(req.body);
    user1.save((err) => {
        if (err) {
            return res.send(401, err)
        }
        res.send(200, "created");
    })
}

async function comparePassword(userpassword, dbpassword) {
    var compared = bcrypt.compare(userpassword, dbpassword);
    return compared;
}

async function userLogin(req, res, next) {
    var findUser = await usersModel.findOne({
        email: req.body.email
    }).catch(err => {
        res.send(404, {
            message: "Not Found"
        })
    });
    if (findUser === null) {
        return res.send(401, {
            message: "Invalid E-mail"
        })
    }
    var compared = await comparePassword(req.body.password, findUser.password).catch(err => {
        if (err) {
            return res.send(500)
        }
    });
    if (compared) {
        req.session.userId = findUser.id;
        var exp = '60s';
        var token = jwt.sign({
            "id": findUser.id,
            "email": findUser.email
        }, 'shhhhh', { expiresIn : exp});
        res.send(200, {
            message: "Successfully Login",
            Access_Token: token
        })
    } else {
        res.send(401, {
            message: "Invalid Password"
        })
    }
}

function putData(req, res, next) {
    var userid = req.params.id;
        usersModel.findByIdAndUpdate(userid, req.body, (err) => {
            if (err) {
                res.send(404, {
                    message: "Not Found"
                })
            }
            res.send(200, {
                message: "Updated"
            });
        });
}

function patchData(req, res, next) {
    var user = req.body;
    var userid = req.params.id;
    if (user.password) {
        bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
            if (err) {
                    return res.send(401, err)
            }
            delete user.password;
            user.password = hash;
            usersModel.findByIdAndUpdate(userid, {
                $set: user
            }, (err) => {
                if (err) {
                    return res.send(401, err)
                }
                res.send(200, {
                    message: "Updated"
                });
            });
        });
    } else {
        usersModel.findByIdAndUpdate(userid, {
            $set: user
        }, (err) => {
            if (err) {
                return res.send(401, err)
            }
            res.send(200, {
                message: "Updated"
            });
        });
    }
}

function deleteData(req, res, next) {
    var userid = req.params.id;
        usersModel.findByIdAndDelete(userid, (err) => {
            if (err) {
                res.send(404, {
                    message: "Not Found"
                })
            }
            res.send(200, {
                message: "Deleted"
            });
        });
}

module.exports = {
    postData,
    userLogin,
    putData,
    patchData,
    deleteData,
}