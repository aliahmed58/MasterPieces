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
    let data = [];

    const ownerID = req.query.ownerID;

    try {
        connection = await oracledb.getConnection();

        ownerInfo = await connection.execute(
            `SELECT * FROM OWNERS where ownerID = :id`, [ownerID]
        );

        let records = await connection.execute(
            `BEGIN
                get_owner_report(:id, :cursor);
            END;`, {
                id: ownerID, 
                cursor: {type: oracledb.CURSOR, dir: oracledb.BIND_OUT}
            }
        );


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

    }
    catch (err) {

        console.log(err);
    }
    finally {
        try {

            res.render('../src/views/owners/OwnerReport', {data: data,  ownerInfo: ownerInfo.rows[0] })

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

const resubmitPainting = async (req, res) => {
    let connection;

    const ownerID = parseInt(req.query.ownerID);
    const paintingID = parseInt(req.query.pid);

    let errMsg = null;

    try {
        connection = await oracledb.getConnection();

        await connection.execute(
            `BEGIN
                resubmit_painting(:pid, :oid);
            END;`, {
                pid: paintingID, 
                oid: ownerID
            }
        );
       
    }
    catch (err) {

        console.log(err);
        errMsg = err;
        res.render('../src/views/ErrorPage', {errMsg: errMsg});
        return;
    }
    finally {
        try {
            await connection.close()
            if (!errMsg) {
                res.redirect(`/owners/report?ownerID=${ownerID}`);
            }
        }
        catch (err) {
            console.log(err.message)
        }
    }
}

const editOwner = async (req, res) => {
    let connection;

    let { firstname, lastname, city, country, address, cellphone } = req.body;

    let error = null;


    try {

        connection = await oracledb.getConnection();
        // call insert procedure by passing name and address
        await connection.execute(
            `BEGIN
                update_owner(:id, :firstname, :lastname, :city, :country, :address, :cellphone);
            END;
            `,
            {
                id: req.query.ownerID, 
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
        res.render('../src/views/owners/EditOwner',  {err: err.message});
        return;
    }
    finally {

        if (!error) {
            res.redirect(`/owners/report?ownerID=${req.query.ownerID}`)
        }
        try {
            await connection.close();
        }
        catch (err) {
            console.log(err)
        }
    }
}

const showEditForm = async (req, res) => {
    let connection;
    let owner;
    const ownerID = req.query.ownerID;

    try {
        connection = await oracledb.getConnection();

        owner = await connection.execute(
            `SELECT * FROM owners WHERE ownerID = :id`, [ownerID]
        )
        owner = owner.rows[0];
    }
    catch (err) {
        error = err
        console.log(err);
    }
    finally {
        try {
            await connection.close()

            res.render('../src/views/owners/EditOwner', { data: owner, err: null })
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
    deleteOwner,
    resubmitPainting,
    editOwner,
    showEditForm
}