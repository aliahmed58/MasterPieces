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

            res.render('../src/views/owners/AllOwners', { data: result.rows })
        }
        catch (err) {
            console.log(err)
        }
    }
}

// generates report for the given owner id
const generateReport = async (req, res) => {

    // get owner info first
    let connection;
    let ownerInfo;

    const ownerID = req.query.ownerID;

    try {
        connection = await oracledb.getConnection();

        ownerInfo = await connection.execute(
            `SELECT * FROM OWNERS where ownerID = :id`, [ownerID]
        );

    }
    catch (err) {

        console.log(err);
    }
    finally {
        try {

            res.render('../src/views/owners/OwnerReport', { data: ownerInfo.rows[0] })

            await connection.close()
        }
        catch (err) {
            console.log(err.message)
        }
    }


}

// render input form 
const renderForm = (req, res) => {
    res.render('../src/views/owners/NewOwner', {err: null})
}

// process input form 
const processForm = async (req, res) => {

    let connection;

    let { firstname, lastname, city, country, address, cellphone } = req.body;

    let error = null;


    try {

        connection = await oracledb.getConnection();
        // call insert procedure by passing name and address
        await connection.execute(
            `BEGIN
                insert_owner(:firstname, :lastname, :city, :country, :address, :cellphone);
            END;
            `,
            {
                firstname: firstname,
                lastname: lastname,
                city: city,
                country: country,
                address: address,
                cellphone: cellphone
            }
        )
    }
    catch (err) {
        error = err;
        console.log(err)
        res.render('../src/views/owners/NewOwner',  {err: err.message});
        return;
    }
    finally {

        if (!error) {
            res.redirect('/')
        }

        try {
            await connection.close();
        }
        catch (err) {
            console.log(err)
        }
    }

}

const deleteOwner = async (req, res) => {

    let connection;
    const ownerID = req.query.ownerID;

    try {
        connection = await oracledb.getConnection();

        await connection.execute(
            `BEGIN
                delete_owner(:id);
            END;`, {id: ownerID}
        );


    }
    catch (err) {

        console.log(err);
    }
    finally {
        try {

            res.redirect('/owners')

            await connection.close()
        }
        catch (err) {
            console.log(err.message)
        }
    }
}

module.exports = {
    listAllOwners,
    generateReport,
    renderForm,
    processForm,
    deleteOwner
}