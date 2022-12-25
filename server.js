require('dotenv').config();

const express = require('express');
const app = express();
const {getdb} = require('./dbconfig');

// get routers from routes
const homeRoutes = require('./src/routes/homeRoute')

// set template engine to ejs
app.set('view engine', 'ejs')

// set bootstrap as the css directory to use in template files
app.use("/css", express.static(__dirname + "/node_modules/bootstrap/dist/css"))
app.use("/public", express.static(__dirname + "/src/public"))

// use home routes
app.use(homeRoutes)

const connection = getdb()
    .then((conn) => {
        app.listen(process.env.PORT,  () => {
            console.log(`connected to database`)
            console.log(`server listening on port ${process.env.PORT}`);
        })
    })
    .catch(err => {
        console.log(err);
    })