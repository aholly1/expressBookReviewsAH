/**
Importing the Express Framework, JSON web token, Express Session, and the two routes:
Customer routes and general routes.
*/
const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;
/**
App variable to initilize express
*/
const app = express();
/**
Middleware funciton
*/
app.use(express.json());
/**
Middleware function
*/
app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))
/**
An authentication Middleware function that checks if a user is allowed to use the program.
if so it sets the user variable to the requested user, if not it returns appropriate user error.
*/
app.use("/customer/auth/*", function auth(req,res,next){
    if(req.session.authorization){
        let token = req.session.authorization["acess"];
        jwt.verify(token, "acess", (err, user) => {
            if(!err){
                req.user = user;
                next();
            }else{
                return res.status(403).json({message: "User not authenticated"})
            }
        })
    }else{
        return res.status(403).json({message: "User not logged in"})

    }
});
/**
Port variable
*/
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);
/**
A listen function for if a server is running on port 5000
*/
app.listen(PORT,()=>console.log("Server is running"));
