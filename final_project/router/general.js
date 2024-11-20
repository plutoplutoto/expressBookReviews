const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    //Write your code here
    const username = req.body.username;
    const password = req.body.password;
    // Check if both username and password are provided
    if (username && password) {
        if (!isValid(username)) {
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    return res.status(404).json({message: "Unable to register user."});
});


// Get the book list available in the shop
public_users.get('/books', function (req, res) {
    //Write your code here
    let myPromise1 = new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve("Promise 1 resolved");
        }, 6000);
    });
    myPromise1.then((message) => {
        console.log(message); 
        res.send(JSON.stringify(books, null, 4)); 
    }).catch((error) => {
        console.error(error); 
        res.status(500).send("An error occurred.");
    });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    //Write your code here
    const isbn = req.params.isbn;
    let getBookByISBN = new Promise((resolve, reject) => {
        setTimeout(() => {
            const book = books[isbn]; 
            if (book) {
                resolve(book); 
            } else {
                reject("Book not found"); 
            }
        }, 2000); 
    });
    getBookByISBN
        .then((book) => {
            res.json(book); 
        })
        .catch((error) => {
            res.status(404).json({ message: error }); 
        });
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    //Write your code here
    const author = req.params.author;
    let getBooksByAuthor = new Promise((resolve, reject) => {
        setTimeout(() => {
            const booksByAuthor = Object.values(books).filter(book => book.author === author);
            if (booksByAuthor.length > 0) {
                resolve(booksByAuthor); 
            } else {
                reject("No books found by this author"); 
            }
        }, 2000); 
    });

    getBooksByAuthor
        .then((books) => {
            res.json(books); 
        })
        .catch((error) => {
            res.status(404).json({ message: error }); 
        });
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    //Write your code here
    const title = req.params.title;
    let getBooksByTitle = new Promise((resolve, reject) => {
        setTimeout(() => {
            const booksByTitle = Object.values(books).filter(book => book.title === title);
            if (booksByTitle.length > 0) {
                resolve(booksByTitle); 
            } else {
                reject("No books found by this title"); 
            }
        }, 2000); 
    });

    getBooksByTitle
        .then((books) => {
            res.json(books); 
        })
        .catch((error) => {
            res.status(404).json({ message: error }); 
        });
});


//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    //Write your code here
    const isbn = req.params.isbn;
    const book = books[isbn];

    if (book && Array.isArray(book.reviews)) {
        res.json(book.reviews);
    } else {
        res.status(404).json({ message: "No reviews found for this book" });
    }
});
module.exports.general = public_users;
