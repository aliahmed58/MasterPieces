require('dotenv').config()
const oracledb = require('oracledb');

const getdb = async () => {
    const connection = await oracledb.getConnection({
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        connectionString: "localhost/xepdb1"
    });

    return connection;
}

module.exports = {getdb};

