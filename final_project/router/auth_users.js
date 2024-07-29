const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
    let req_user = users.filter((user) => {
        return user.username === username;
    });

    return req_user.length > 0;
}

const authenticatedUser = (username, password) => {
    let req_user = users.filter((user) => {
        return user.username === username && user.password === password;
    });

    return req_user.length > 0;
}

// Only registered users can login
regd_users.post("/login", (req, res) => {
    if (authenticatedUser(req.body.username, req.body.password)) {
        let accessToken = jwt.sign({
            data: "user"
        }, 'access', { expiresIn: '1h' }); // Corrected expiresIn

        req.session.authorization = {
            accessToken
        };
        return res.status(200).json({ message: "User successfully logged in" });
    }
    res.status(403).json({ message: "You are not a registered user" });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    let isbn = req.params.isbn;
    let book = books.find((book) => book.isbn === isbn);

    if (book) {
        let review = req.body.review;
        book.reviews.push(review); // Ensure reviews array exists
        return res.status(201).send("Review successfully added");
    }
    return res.status(403).json({ message: "The book doesn't exist in the library" });
});

// Delete a book review
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
