const oracledb = require('oracledb')

const listAllCustomers = async (req, res) => {

    let connection;
    let result;

    try {

        connection = await oracledb.getConnection();

        result = await connection.execute(
            `SELECT * FROM CUSTOMERS`
        )
    }
    catch (err) {
        console.log(err);
    }
    finally {
        try {

            res.render('../src/views/customers/AllCustomers', { data: result.rows })
            await connection.close();
        }
        catch (err) {
            console.log(err.message)
        }
    }


}

// generate report for the given customer id
const generateReport = async (req, res) => {

    let connection;
    let result;
    let category;

    const customerID = req.query.customerID;

    try {

        connection = await oracledb.getConnection();

        result = await connection.execute(
            `SELECT * FROM CUSTOMERS WHERE customerID = :id`, [customerID]
        );

        category = await connection.execute(
            `SELECT * FROM CATEGORY WHERE categoryID = :id`, [result.rows[0][6]]
        );

    }
    catch (err) {
        console.log(err);
    }
    finally {
        try {
            res.render('../src/views/customers/CustomerReport', { data: result.rows[0], category: category.rows[0] })
            await connection.close()
        }
        catch (err) {
            console.log(err.message)
        }
    }
}

// render input form
const renderForm = async (req, res) => {
    let connection;
    let categories;

    try {
        // get oracledb connection
        connection = await oracledb.getConnection()

        // get categories 
        categories = await connection.execute(`SELECT categoryID, categoryName FROM CATEGORY`);

    } catch (err) {
        console.log(err)
    }
    finally {
        try {
            res.render('../src/views/customers/NewCustomer', { categories: categories.rows })
            await connection.close()
        }
        catch (err) {
            console.log(err)
        }
    }
}

const processForm = async (req, res) => {

    let connection;
    let firstname = req.body.firstname;
    let lastname = req.body.lastname;
    let address = req.body.address;
    let city = req.body.city;
    let country = req.body.country;
    let description = req.body.description;
    let categoryID = req.body.category;

    try {
        connection = await oracledb.getConnection();

        await connection.execute(
            `BEGIN
                insert_customer(
                    :fname, :lname, :city, :country, :address, :categoryID, :description);
            END;`,
            {
                fname: firstname,
                lname: lastname,
                city: city,
                country: country,
                address: address,
                categoryID: categoryID,
                description: description
            }
        )
    }
    catch (err) {
        console.log(err)
    }
    finally {
        try {
            res.redirect('/');

            await connection.close()

        }
        catch (err) {
            console.log(err)
        }
    }

}

const deleteCustomer = async (req, res) => {

    let connection;
    const customerID = req.query.customerID;

    console.log(customerID)
    
    try {
        connection = await oracledb.getConnection();
        await connection.execute(
            `BEGIN
                delete_customer(:id);
            END;`, {id: customerID}
        );

    }
    catch (err) {
        
        console.log(err);
    }
    finally {
        try {

            res.redirect('/customers')

            await connection.close()
        }
        catch (err) {
            console.log(err.message)
        }
    }
}

module.exports = {
    listAllCustomers,
    generateReport,
    renderForm,
    processForm,
    deleteCustomer
}