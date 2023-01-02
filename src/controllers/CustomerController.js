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
    let data = [];
    let customer;

    const customerID = req.query.customerID;

    try {

        connection = await oracledb.getConnection();

        /*
        * Cursor from get_customer_report contains data in the following indexes:
        * 0: Customer ID
        * 1: First Name
        * 2: Last Name
        * 3: City
        * 4: Country 
        * 5: Address
        * 6: Description
        * 7: Category
        * 8: Discount
        * 9: Painting ID
        * 10: Painting Name
        * 11: Painting Theme
        * 12: Rent Date
        * 13: Due Date
        * 14: Returned (1/0)
        * 15: Returned date
        */
        let records = await connection.execute(
            `BEGIN
                get_customer_report(:id, :cursor);
            END;`, {
            id: customerID,
            cursor: {
                type: oracledb.CURSOR,
                dir: oracledb.BIND_OUT
            }
        }
        )

        const cursor = records.outBinds.cursor;
        const queryStream = cursor.toQueryStream();

        const consumeStream = new Promise((resolve, reject) => {
            queryStream.on('data', function (row) {
                data.push(row)
            });
            queryStream.on('error', reject);
            queryStream.on('close', resolve);
        });

        await consumeStream;

        customer = await connection.execute(
            `SELECT * FROM CUSTOMERS C 
            INNER JOIN CATEGORY L ON C.CATEGORYID = L.CATEGORYID
            WHERE customerID = :id`, [customerID]
        )

    }
    catch (err) {
        console.log(err);
    }
    finally {
        try {
            res.render('../src/views/customers/CustomerReport', { data: data, customer: customer.rows })
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

    try {
        connection = await oracledb.getConnection();
        await connection.execute(
            `BEGIN
                delete_customer(:id);
            END;`, { id: customerID }
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

const returnPainting = async (req, res) => {

    let connection;
    let { customerID, paintingID } = req.query;

    customerID = parseInt(customerID);
    paintingID = parseInt(paintingID);

    try {
        connection = await oracledb.getConnection();

        await connection.execute(
            `BEGIN
                customer_return_painting(:customerID, :paintingID);
            END;`, { customerID: customerID, paintingID: paintingID }
        )

    }
    catch (err) {

        console.log(err);
    }
    finally {
        try {

            res.redirect(`/customers/report/?customerID=${customerID}`)

            await connection.close()
        }
        catch (err) {
            console.log(err.message)
        }
    }
}

const editCustomer = async (req, res) => {
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
                update_customer(
                    :id, :fname, :lname, :city, :country, :address, :categoryID, :description);
            END;`,
            {
                id: req.query.customerID,
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
            res.redirect(`/customers/report?customerID=${req.query.customerID}`);

            await connection.close()

        }
        catch (err) {
            console.log(err)
        }
    }

}

const showEditForm = async (req, res) => {
    let connection;
    let error = null;
    let customer;
    let categories;
    const customerID = req.query.customerID;

    try {
        connection = await oracledb.getConnection();

        customer = await connection.execute(
            `SELECT * FROM customers WHERE customerID = :id`, [customerID]
        )

        // get categories 
        categories = await connection.execute(`SELECT categoryID, categoryName FROM CATEGORY`);

        customer = customer.rows[0];
    }
    catch (err) {
        error = err
        console.log(err);
    }
    finally {
        try {
            await connection.close()

            res.render('../src/views/customers/EditCustomer', { categories: categories.rows, data: customer,  })
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
    deleteCustomer,
    returnPainting,
    editCustomer,
    showEditForm
}