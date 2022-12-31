require('dotenv').config()
const oracledb = require('oracledb');

const createTables = require('./createTables');
const createArtistProcedures = require('./src/database/artistProcedures');
const createCommonTriggers = require('./src/database/common');
const createCustomerProcedures = require('./src/database/customerProcedures');
const createOwnerProcedures = require('./src/database/ownerProcedures');
const createPaintingProcedures = require('./src/database/paintingProcedures');

const initdb = async () => {

    let connection;

    try {
        await oracledb.createPool({
            user: "admin",
            password: "sysadmin",
            connectionString: "oracle-102655-0.cloudclusters.net:16756/XE",
            poolIncrement: 0,
            poolMin: 4,
            poolMax: 4
        })

        // create tables needed for database
        connection = await oracledb.getConnection();

        if (process.env.INIT_TABLES == 1) {
            console.log('DATABASE TABLES DROPPED AND CREATED')
            // await dropAllTables(connection)
            // Create tables 
            await createTables(connection);
        }
        

        // CREATE PROCEDURES AND TRIGGERS

        // create common triggers
        await createCommonTriggers(connection);

        // create owner procedures
        await createOwnerProcedures(connection)

        // create artist procedures
        await createArtistProcedures(connection)

        // create customer procedures
        await createCustomerProcedures(connection)

        // create painting procedures
        await createPaintingProcedures(connection)

    }
    catch (err) {
        console.log('db init error' + err.message)
    }

    // close connection after using
    finally {
        if (connection) {
            try {
                await connection.close();
            }
            catch(err) {
                console.log(err)
            }
        }
    }

}

module.exports = initdb

