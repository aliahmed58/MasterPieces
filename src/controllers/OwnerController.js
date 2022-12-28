const oracledb = require('oracledb')

const listAllOwners = async (req, res) => {

    let connection;
    let result;

    try {
        connection = await oracledb.getConnection();

        result = await connection.execute(
            `SELECT * FROM OWNERS`
        )

    }
    catch (err) {
        console.log(err);
    }
    finally {
        try {
            await connection.close();

            /*
            Result.rows has the following format
                Example: rows = [ [ 1, 'Kashif', 'London' ] ]
                for row in rows:
                    0: id
                    1: name
                    2: address
            */

            res.render('../src/views/owners/AllOwners', {data: result.rows})
        }
        catch (err) {
            console.log(err)
        }
    }
}

// generates report for the given owner id
const generateReport = (req, res) => {
    res.render('../src/views/owners/OwnerReport', data)
}

// render input form 
const renderForm = (req, res) => {
    res.render('../src/views/owners/NewOwner')
}

// process input form 
const processForm = async (req, res) => {

    let connection;

    let name = req.body.name;
    let address = req.body.address;

    try {

        connection = await oracledb.getConnection();
        // call insert procedure by passing name and address
        await connection.execute(
            `BEGIN
                insert_owner(:owner_name, :owner_address);
            END;
            `,
            {
                owner_name: name,
                owner_address: address
            }
        )
    }
    catch (err) {
        console.log(err)
    }
    finally {

        res.redirect('/')

        try {
            await connection.close();
        }
        catch (err) {
            console.log(err)
        }
    }

}

module.exports = {
    listAllOwners,
    generateReport,
    renderForm,
    processForm
}