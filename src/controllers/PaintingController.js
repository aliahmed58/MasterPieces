const oracledb = require('oracledb');
const { convertDate } = require('../../helper');

// list all paintings
const listAllPaintings = async (req, res) => {
    let connection;
    let paintings;
    try {
        connection = await oracledb.getConnection();

        paintings = await connection.execute(`SELECT * FROM PAINTINGS`);

    }
    catch (err) {

        console.log(err);
    }
    finally {
        try {

            res.render('../src/views/paintings/AllPaintings', { data: paintings.rows })

            await connection.close()
        }
        catch (err) {
            console.log(err.message)
        }
    }
}

// render painting form
const renderForm = async (req, res) => {
    // get artist and owners to display in lists
    let connection;
    let artists;
    let owners;
    try {
        connection = await oracledb.getConnection();

        owners = await connection.execute(`SELECT * FROM OWNERS`);
        artists = await connection.execute(`SELECT * FROM ARTISTS`);

    }
    catch (err) {

        console.log(err);
    }
    finally {
        try {
            res.render('../src/views/paintings/NewPainting', { owners: owners.rows, artists: artists.rows });
            await connection.close()
        }
        catch (err) {
            console.log(err.message)
        }
    }
}

const processForm = async (req, res) => {
    let connection;

    let name = req.body.name;
    let rental = req.body.rental;
    let theme = req.body.theme;
    let artistID = parseInt(req.body.artists);
    let ownerID = parseInt(req.body.owners);
    
    
    try {
        connection = await oracledb.getConnection();

        await connection.execute(
            `BEGIN
                insert_painting(:name, :rental, :theme, :artistID, :ownerID);
            END;`,
            {
                name: name, rental: rental, theme: theme, artistID: artistID, ownerID: ownerID
            }
        )
    }
    catch (err) {

        console.log(err);
    }
    finally {
        try {
            res.redirect('/')

            await connection.close()
        }
        catch (err) {
            console.log(err.message)
        }
    }
}

const deletePainting = async (req, res) => {
    
    let connection;
    
    const paintingID = req.query.paintingID;
    
    try {
        connection = await oracledb.getConnection();

        await connection.execute(
            `BEGIN
                delete_painting(:id);
            END;`, {id: paintingID}
        );

    }
    catch (err) {

        console.log(err);
    }
    finally {
        try {

            res.redirect('/paintings')

            await connection.close()
        }
        catch (err) {
            console.log(err.message)
        }
    }
}

const hirePainting = async (req, res) => {
    let connection;

    let result;
    let data = [];
    let customers;

    try {
        connection = await oracledb.getConnection();

        result = await connection.execute(
            `BEGIN
                get_available_paintings(:cursor);
            END;`,
            {
                cursor: {
                    type: oracledb.CURSOR, 
                    dir: oracledb.BIND_OUT
                }
            }
        )

        customers = await connection.execute(
            `SELECT customerID, first_name, last_name FROM CUSTOMERS`
        );

        const cursor = result.outBinds.cursor;
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
            res.render('../src/views/paintings/HirePainting', {data: data, customers: customers.rows});

            await connection.close()
        }
        catch (err) {
            console.log(err.message)
        }
    }
}

const processHirePainting = async (req, res) => {
    
    let {rentdate, duedate, artistID, customerID} = req.body;

    // convert dates to ORACLE format
    rentdate = convertDate(rentdate);
    duedate = convertDate(duedate);

    let connection;

    try {
        connection = await oracledb.getConnection();

        await connection.execute(
            `BEGIN
                rent_painting(:rentdate, :duedate, :customerID, :artistID);
            END;`,
            {
                rentdate: rentdate, duedate: duedate, customerID: customerID, artistID: artistID
            }
        )
       
    }
    catch (err) {

        console.log(err);
    }
    finally {
        try {

            res.redirect('/')

            await connection.close()
        }
        catch (err) {
            console.log(err.message)
        }
    }
}


module.exports = {
    renderForm,
    processForm,
    listAllPaintings,
    deletePainting,
    hirePainting, 
    processHirePainting
}