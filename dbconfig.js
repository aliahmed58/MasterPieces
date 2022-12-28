require('dotenv').config()
const oracledb = require('oracledb');

const initdb = async () => {
    try {

        await oracledb.createPool({
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            connectionString: "localhost/xepdb1",
            poolIncrement: 0,
            poolMin: 4,
            poolMax: 4
        })

    }
    catch (err) {
        console.log('db init error' + err.message)
    }

}

module.exports = initdb

