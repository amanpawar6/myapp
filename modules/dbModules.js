const zipsModel = require('../model/Zips');

function allData(req, res, next) {
    var queryParams = req.query;
    console.log(">>>>>>", queryParams)
    zipsModel.find(queryParams, function (err, data) {
        if (err) {
            res.json(err)
        }
        console.log('>>>>>', queryParams);
        res.json(data);
    }).limit(5)
}

function postData(req, res, next) {
    var user = req.body;
    var user1 = new zipsModel(user);
    user1.save((err, data) => {
        if (err) {
            return console.log(">>>>>", err)
        }
        res.json(data);
    })
}

function putData(req, res, next) {
    var dataId = req.params.id;
    var user = req.body;
    console.log(">>>>>>>", dataId, user)
    zipsModel.update({_id: dataId}, user, (err, data) => {
        if (err) {
            console.log(err);
        }
        console.log(data);
        res.send(data);
    });
}

function patchData(req, res, next) {
    var dataId = req.params.id;
    var user = req.body;
    console.log(">>>>>>>", dataId, user)
    const response = zipsModel.findByIdAndUpdate(dataId, {
        $set: user
    });
    res.send(200, response);
}

const deletedata = function (req, res, next) {
    const userId = req.params.id;
    zipsModel.findByIdAndDelete(userId, (err, data) => {
        if (err) {
            console.log(err);
        }
        console.log("Successful deletion");
        res.json(data);
    });
}


module.exports = {
    putData,
    allData,
    postData,
    patchData,
    deletedata
}