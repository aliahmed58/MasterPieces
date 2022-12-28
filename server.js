require('dotenv').config();

const express = require('express');
const app = express();
const {getdb} = require('./dbconfig');

// get routers from routes
const homeRoutes = require('./src/routes/homeRoute')
const artistRoutes = require('./src/routes/artistRoutes')
const customerRoutes = require('./src/routes/customerRoutes')
const ownerRoutes = require('./src/routes/ownerRoutes')

// set template engine to ejs
app.set('view engine', 'ejs')

// set bootstrap as the css directory to use in template files
app.use("/css", express.static(__dirname + "/node_modules/bootstrap/dist/css"))
app.use("/public", express.static(__dirname + "/src/public"))


// use home routes
app.use(homeRoutes)

// artists routes - all urls with /artists
app.use('/artists', artistRoutes)

// owner routes - all urls with /owners
app.use('/owners', ownerRoutes)

// customer routes - all urls with /customers
app.use('/customers', customerRoutes)

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