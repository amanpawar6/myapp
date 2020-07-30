const fs = require('fs');
const path = require('path');

let users = [];
var userId = 0;
let books = [];
var booksId = 0;
var pathUsers = path.join(__dirname, '..','/data/users.json');
var pathBooks = path.join(__dirname, '..','/data/books.json');

// function test(data){
//     fs.appendFile(pathUsers, data + '\n', (err) => console.log(err) )
// }

readUsers();

function readUsers() {
    fs.readFile(pathUsers, (err, data) => {
        if (err) {
            console.log(err);
        }
        users = JSON.parse(data);
        if(users.length === 0){
            userId = 0;
        }else{
            userId = users[users.length - 1].id;
        }
    })
}

function writeUsers(Data){
    fs.writeFile(pathUsers, JSON.stringify(Data), (err) => console.log(err))
}

readbooks();

function readbooks() {
    fs.readFile(pathBooks, (err, data) => {
        if (err) {
            console.log(err);
        }
        books = JSON.parse(data);
        if(books.length === 0){
            booksId = 0;
        }else{
            booksId = books[books.length - 1].id;
        }
    })
}

function writeBooks(Data){
    fs.writeFile(pathBooks, JSON.stringify(Data), (err) => console.log(err))
}

function allData(req, res, next) {
    res.send(200, users);
}

function getById(req, res, next) {
    let userId = req.params.id;
    const user = users.filter(item => item.id === userId);
    if (user.length === 0) {
        return res.send(404, {
            message: 'users not found'
        });
    }
    res.send(user);
}

function postData(req, res, next) {
    let user = req.body;
    user.id = (++userId).toString();
    users.push(user);
    writeUsers(users);
    // test(users);
    res.send(201, {
        message: `created`
    });
}

function putData(req, res, next) {
    let user = req.body;
    delete user.id;
    users.forEach((item) => {
        if (item.id === req.userId) {
            item.title = req.body.title;
            item.age = req.body.age;
        }
    })
    writeUsers(users);
    res.send(200, {
        message: `updated`
    })
}

function deleteData(req, res, next) {
    users.splice(req.userExists, 1);
    writeUsers(users);
    res.send(200, {
        message: `Deleted user ${req.userId}`
    });
}

function userExists(req, res, next) {
    let userId = req.params.id;
    const userExists = users.findIndex(item => item.id === userId);
    if (userExists == -1) {
        return res.send(404, {
            message: 'users not found'
        })
    }
    req.userExists = userExists;
    req.userId = userId;
    next();
}

function bookExists(req, res, next) {
    let bookid = req.params.bookid;
    const userExists = books.findIndex(item => item.id === bookid);
    if (userExists == -1) {
        return res.send(404, {
            message: 'users not found'
        })
    }
    req.userExists = userExists;
    req.bookid = bookid;
    next();
}

function getBybookId(req, res, next) {
    let userId = req.params.id;
    const user = books.filter(item => item.id === userId);
    if (user.length === 0) {
        return res.send(404, {
            message: 'No record found'
        });
    }
    res.send(user);
}

function createBook(req, res, next) {
    let book = req.body;
    book.id = (++booksId).toString();
    books.push(book);
    writeBooks(books);
    res.send(201, {
        message: `created`
    });
}

function updateBook(req, res, next) {
    let user = req.body;
    delete user.id;
    books.forEach((item) => {
        if (item.id === req.bookid) {
            item.title = req.body.title;
            item.age = req.body.age;
            item.userId = req.userId;
        }
    })
    writeBooks(books);
    res.send(200, {
        message: `updated`
    })
}

function deletebook(req, res, next) {
    books.splice(req.userExists, 1);
    writeBooks(books);
    res.send(200, {
        message: `Deleted user ${req.bookid}`
    });
}

function validation(req, res, next) {
    let userId = req.params.id;
    let bookid = req.params.bookid;
    if (userId !== bookid) {
        return res.status(401).send('user not unauthorised');
    }
    next();
}

function userValidation(req, res, next){
    let user = req.body;
    const userExists = users.findIndex(item => item.title === user.title);
    if(userExists > -1){
        return res.send(409, {message : `user exists ${user.title}`})
    }
    next();
}

function bookValidation(req, res, next){
    let book = req.body;
    const userExists = users.findIndex(item => item.title === book.title);
    if(userExists > -1){
        return res.send(409, {message : `user exists ${book.title}`})
    }
    next();
}

module.exports = {
    userExists,
    getById,
    postData,
    putData,
    deleteData,
    allData,
    bookExists,
    getBybookId,
    updateBook,
    createBook,
    deletebook,
    validation,
    userValidation,
    bookValidation
}