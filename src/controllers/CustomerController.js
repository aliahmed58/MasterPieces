const oracledb = require('oracledb')

const listAllCustomers = (req, res) => {
    res.render('../src/views/customers/AllCustomers')
}

// generate report for the given customer id
const generateReport = (req, res) => {
    res.render('../src/views/customers/CustomerReport')
}

// render input form
const renderForm = async (req, res) => {
    let connection;
    let categories;

    try {
        // get oracledb connection
        connection = await oracledb.getConnection()
         
        // get categories 
        categories = await connection.execute(`SELECT category FROM CATEGORY`);

    } catch(err) {
        console.log(err)
    }
    finally {
        try {
            res.render('../src/views/customers/NewCustomer', {categories: categories.rows})
            await connection.close()
        }
        catch (err) {
            console.log(err)
        }
    }
}

module.exports = {listAllCustomers, generateReport, renderForm}