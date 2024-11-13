const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {

    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });

    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}


const authenticatedUser = (username, password) => {
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}


//only registered users can login
regd_users.post("/login", (req, res) => {
    console.log("login endpoint");
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }
    if (authenticatedUser(username, password)) {

        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });

        req.session.authorization = {
            accessToken, username
        }
        console.log(req.session)
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});


// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    //Write your code here
    const isbn = req.params.isbn;
    const users = req.params.users;
    let book = books[isbn];
    if (users) {
        console.log(book)
        let username = req.body.username;
        let reviews = req.body.reviews;
        console.log(`uuuu: ${reviews}`)
        let isbn = req.body.isbn;

        if (username) {
            users["username"] = username;
        }
        if (reviews) {
            users["reviews"] = reviews;
        }
        if (isbn) {
            users["isbn"] = isbn;
        }

        users[reviews] = users;
        res.send(`Review with the username ${username} updated.`);
    } else {

        res.send("Unable to find user!");
    }
    console.log(book)
});
regd_users.delete("/auth/review/:isbn", (req, res) => {
    
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
