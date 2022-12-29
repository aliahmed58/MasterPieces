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

const processForm =  async (req, res) => {

    let connection; 
    let name = req.body.name;
    let address = req.body.address;
    let description = req.body.description;
    let category = req.body.category;

    try {
        connection = await oracledb.getConnection();

        await connection.execute(
            `BEGIN
                insert_customer(:name, :address, :description, :category);
            END;`,
            {
                name: name, address: address, description: description, category: category
            }
        )
    }
    catch(err) {
        console.log(err)
    }
    finally {
        try {
            res.redirect('/');

            await connection.close()

        }
        catch(err) {
            console.log(err)
        }
    }

}

module.exports = {
    listAllCustomers, 
    generateReport, 
    renderForm,
    processForm
}