require('dotenv').config({
    path: './.env.production'
});

const express = require('express');
const app = express();
const initdb = require('./dbconfig');
const bodyParser  = require('body-parser')

// get routers from routes
const homeRoutes = require('./src/routes/homeRoute')
const artistRoutes = require('./src/routes/artistRoutes')
const customerRoutes = require('./src/routes/customerRoutes')
const ownerRoutes = require('./src/routes/ownerRoutes')
const paintingRoutes = require('./src/routes/paintingRoutes')

// set template engine to ejs
app.set('view engine', 'ejs')

// use body parser to read forms
app.use(bodyParser.urlencoded({extended: true}))

// set bootstrap as the css directory to use in template files
app.use("/css", express.static(__dirname + "/node_modules/bootstrap/dist/css"))
app.use("/js", express.static(__dirname + "/node_modules/bootstrap/dist/js"))
app.use("/public", express.static(__dirname + "/src/public"))

// use home routes
app.use(homeRoutes)

// artists routes - all urls with /artists
app.use('/artists', artistRoutes)

// owner routes - all urls with /owners
app.use('/owners', ownerRoutes)

// customer routes - all urls with /customers
app.use('/customers', customerRoutes)

// painting routes - all urls with /paintings
app.use('/paintings', paintingRoutes)


initdb()
    .then(() => {
        app.listen(process.env.PORT,  () => {
            console.log(`connected to database as user: ${process.env.DB_USER}`)
            console.log(`server listening on port ${process.env.PORT}`);
        })
    })
    .catch(err => {
        console.log(err);
    })