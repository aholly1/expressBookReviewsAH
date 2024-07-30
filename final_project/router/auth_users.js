/**
Importing Express Framework, JSON web token, Books Database, and regeserted users router
*/
const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();
/**
Variable for the list of users
*/
let users = [];

/**
Function to determine if the input within the paramater is valid
*/
const isValid = (username) => {
    let req_user = users.filter((user) => {
        return user.username === username;
    });

    return req_user.length > 0;
}
/**
A function that determines if the given user inside the parameter - username & password
is contained within the list of users
*/
const authenticatedUser = (username, password) => {
    let req_user = users.filter((user) => {
        return user.username === username && user.password === password;
    });

    return req_user.length > 0;
}

/**
Middleware that creates a Token for if a user requests to login and their credientials are 
contained in the list of users.
*/
regd_users.post("/login", (req, res) => {
    if (authenticatedUser(req.body.username, req.body.password)) {
        let accessToken = jwt.sign({
            data: "user"
        }, 'access', { expiresIn: '1h' }); 

        req.session.authorization = {
            accessToken
        };
        return res.status(200).json({ message: "User successfully logged in" });
    }
    res.status(403).json({ message: "You are not a registered user" });
});

/**
Middleware to add a review to a book. This function first checks if the requested
book exists, if so it adds a review to the set of reviews for that specific book.
*/
regd_users.put("/auth/review/:isbn", (req, res) => {
    let isbn = req.params.isbn;
    let book = books.find((book) => book.isbn === isbn);

    if (book) {
        let review = req.body.review;
        book.reviews.push(review); 
        return res.status(201).send("Review successfully added");
    }
    return res.status(403).json({ message: "The book doesn't exist in the library" });
});

/**
Finds a book within the database of books and removies a review within the books set of reviews
*/
regd_users.delete("/auth/review/:isbn", (req, res) => {
    let isbn = req.params.isbn;
    let book = books.find((book) => book.isbn === isbn);

    if (book) {
        let reviewIndex = book.reviews.findIndex((review) => review.username === req.body.username);
        if (reviewIndex !== -1) {
            book.reviews.splice(reviewIndex, 1);
            return res.status(200).send("Review successfully deleted");
        }
        return res.status(404).json({ message: "Review not found" });
    }
    return res.status(403).json({ message: "The book doesn't exist in the library" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
