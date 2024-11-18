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
        console.log(`look: ${req.session.authorization.username}`)
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});


// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    //     //Write your code here
    console.log("jojojojojojojojoj");
    function updateBooks() {
        const isbn = req.params.isbn
        const username = req.session.authorization.username
        let book = books[isbn]
        console.log(username);
        if (username) {
            books[isbn].reviews[username] = req.body.reviews;
            return res.status(200).json({ message: `Review with ${req.session.authorization.username} updated successfully.`, book });
        }else {
        res.send("Unable to find username!");
    }
}
        updateBooks();

    });
// console.log(books);








module.exports = regd_users;
regd_users.delete("/auth/review/:isbn", (req, res) => {

});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
