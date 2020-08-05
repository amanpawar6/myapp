const usersModel = require('../model/userData');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const checkExistingUser = (req, res, next) => {
    usersModel.find({email : req.body.email}, (err,data) =>{
        if(err){console.log(err)}
        if (data.length > 0) {
            return res.send(401, {
                message: "User Already Exists"
            })
        }else{
            next();
        }
    })
}

function postData(req, res, next) {
    var user = req.body;
    bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
        if (err) {
            console.log(">>>>>", err)
        }
        delete user.password;
        user.password = hash;
        var user1 = new usersModel(user);
        user1.save((err) => {
            if (err) {
                return res.json(401, err)
            }
            res.json(200, "created");
        })
    });
}

async function comparePassword(userpassword, dbpassword) {
    var compared = bcrypt.compare(userpassword, dbpassword);
    return compared;
}

async function getData(req, res, next) {
    var userData = [];
    await usersModel.findOne({
        email: req.body.email
    }, (err, data) => {
        if (err) {
            console.log(err)
        }
        if (data === null) {
            return res.send(401, {
                message: "Data Not Found"
            })
        }
        userData = data;
    })
    var compared = await comparePassword(req.body.password, userData.password);
    if (compared) {
        req.session.userId = userData.id;
        res.send(200, {
            message: "Login"
        })
    } else {
        res.send(401, {
            message: "Unauthorized"
        })
    }
}

const valdidation = (req, res, next) => {
    console.log(">>>>>", req.session.userId);
    if(!req.session.userId){
        res.send(401, {message: "session id issue"});
    } else {
        next()
    }
}

async function putData(req, res, next){
        var user = req.body;
        var userid = req.params.id;
        await bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
            if (err) {
                console.log(">>>>>", err)
            }
            delete user.password;
            user.password = hash;
        if(userid === req.session.userId){
        console.log(">>>>>>>", req.session.userId, user, userid)
        usersModel.findByIdAndUpdate(userid, user, (err, data) => {
            if (err) {
                console.log(err);
            }
            res.send(200, {message: "Updated"});
        });
    }else {
        res.send(401, {message: "Unauthorized"});
    }
})}

async function patchData(req, res, next){
    var user = req.body;
    var userid = req.params.id;
    if(user.password){
        await bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
            if (err) {
                console.log(">>>>>", err)
            }
            delete user.password;
            user.password = hash;
        if(userid === req.session.userId){
        console.log(">>>>>>>", req.session.userId, user, userid)
        usersModel.findByIdAndUpdate(userid, {$set : user}, (err, data) => {
            if (err) {
                console.log(err);
            }
            res.send(200, {message: "Updated"});
        });
    }else {
        res.send(401, {message: "Unauthorized"});
    }
    })}else{
        if(userid === req.session.userId){
            console.log(">>>>>>>", req.session.userId, user, userid)
            usersModel.findByIdAndUpdate(userid, {$set : user}, (err, data) => {
                if (err) {
                    console.log(err);
                }
                res.send(200, {message: "Updated"});
            });
        }else {
            res.send(401, {message: "Unauthorized"});
        }
    }
    }

function deleteData(req, res, next){
    var userid = req.params.id;
    if(userid === req.session.userId){
        usersModel.findByIdAndDelete(userid, (err) => {
            if (err) {
                console.log(err);
            }
            res.send(200, {message: "Deleted"});
        });
    }else {
        res.send(401, {message: "Unauthorized"});
    }
}

module.exports = {
    postData,
    getData,
    putData,
    valdidation,
    patchData,
    deleteData,
    checkExistingUser
}