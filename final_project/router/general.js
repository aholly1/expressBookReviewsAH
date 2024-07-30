/**
Imported Express framework, Axios Package (for async), Book JS database, and other important functions and data.
*/
const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

/**
Created an endpoint for the API (retrieves the books)
*/
const booksEndpoint = books; 

/**
Middleware to add a user to the growing list of users.
*/
public_users.post("/register", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const userExists = users.some(user => user.username === username);

    if (userExists) {
        return res.status(403).json({ message: "That username has already been taken" });
    }

    const passwordExists = users.some(user => bcrypt.compareSync(password, user.password));

    if (passwordExists) {
        return res.status(403).json({ message: "That password has already been chosen" });
    }

    users.push({ username, password });

    return res.status(201).json({ message: "User successfully registered" });
});

/**
Middleware that retrieves the map of the database of books and converts the response into a String
*/
public_users.get('/', async function (req, res) {
    try {
        const response = await axios.get(booksEndpoint);
        const listOfBooks = response.data; 
        res.json(listOfBooks);
    } catch (error) {
        console.error(error.toString());
        res.status(500).send('An error occurred while fetching the book list');
    }
});

/**
Middleware to retrieve a book from the database that matches a requested ISBN value - an index val
*/
public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;
    try {
        const response = await axios.get(`${booksEndpoint}/isbn/${isbn}`);
        const book = response.data; 
        res.json(book);
    } catch (error) {
        console.error(error.toString());
        res.status(404).send("Unable to find requested book");
    }
});

/**
Middleware to retrieve a book from the database that matches a requested Author Name
*/
public_users.get('/author/:author', async function (req, res) {
    const authorReq = req.params.author.toLowerCase();
    try {
        const response = await axios.get(`${booksEndpoint}/author/${authorReq}`);
        const filteredBooks = response.data;
        res.json(filteredBooks);
    } catch (error) {
        console.error(error.toString());
        res.status(404).send("Unable to find requested book");
    }
});

/**
Middleware to retrieve a book from the database that matches a requested Title
*/
public_users.get('/title/:title', async function (req, res) {
    const titleReq = req.params.title.toLowerCase();
    try {
        const response = await axios.get(`${booksEndpoint}/title/${titleReq}`);
        const filteredBooks = response.data; 
        res.json(filteredBooks);
    } catch (error) {
        console.error(error.toString());
        res.status(404).send("Unable to find requested book");
    }
});

/**
Middleware to retrieve the review (set of strings) for a book from the database that matches a requested ISBN value
*/
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];

    if (book) {
        res.send(book.reviews);
    } else {
        res.status(404).send("Unable to find requested book");
    }
});

module.exports.general = public_users;
