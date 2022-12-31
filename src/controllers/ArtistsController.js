const { convertDate } = require('../../helper')
const oracledb = require('oracledb')

// ----- Exported functions below -----

// show all artists in a list
const listAllArtists = async (req, res) => {
    let connection;
    let result;

    try {
        connection = await oracledb.getConnection("main");

        result = await connection.execute(
            `SELECT * FROM ARTISTS`
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
            res.render('../src/views/artists/AllArtists', { data: result.rows })
        }
        catch (err) {
            console.log(err)
        }
    }
}

// generate report for the given artist id
const generateReport = async (req, res) => {

    let connection;
    let result;

    let data = [];
    let artists;

    try {
        connection = await oracledb.getConnection();
        // fetch relevant data using the procedure
        /*
        * DATA Retruned as an array, the following indexes represent respective values:
        * 0: Artist ID
        * 1: Artist First name
        * 2: Artist Last name
        * 3: Artist dob
        * 4: Artist age
        * 5: Artist Death date
        * 6: Artist Country
        * 7: Painting ID
        * 8: Painting Name
        * 9: Painting theme
        * 10: Monthly Renal
        * 11: Owner ID
        * 12: Owner First Name
        * 13: Owner Last Name
        * 14: Owner cellphone
        */  

        let records = await connection.execute(
            `BEGIN
                get_artist_report(:id, :cursor);
            END;`,
            {
                id: parseInt(req.query.artistID),
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

        // if there aren't any paintings for that artist, fetch his own data 
        artists = await connection.execute(
            `SELECT * FROM ARTISTS WHERE artistID = :id`, [req.query.artistID]
        );

    }
    catch (err) {
        console.log(err)
    }

    finally {
        try {

            res.render('../src/views/artists/ArtistReport', { data: data, artists: artists.rows })

            // close db connection
            await connection.close()
        }
        catch (err) {
            console.log(err)
        }
    }


}

// render form for new artist
const renderForm = (req, res) => {
    res.render('../src/views/artists/NewArtist', {err : null})
}

// process input form
const processForm = async (req, res) => {

    let connection;
    let { firstname, lastname, country, dob, dod } = req.body;

    let error;

    dob = convertDate(dob)

    if (dod === '') dod = null;
    else dod = convertDate(dod)

    try {

        connection = await oracledb.getConnection();
        // call insert procedure by passing name and address
        await connection.execute(
            `BEGIN
                insert_artist (:fname, :lname, :country, :dob, :dod);
            END;
            `,
            {
                fname: firstname,
                lname: lastname,
                country: country,
                dob: dob,
                dod: dod
            }
        )
    }
    catch (err) {
        error = err;
        console.log(err.message)
        // if error is caught - render back the form with the error displayed
        res.render('../src/views/artists/NewArtist', {err: err.message})
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

const deleteArtist = async (req, res) => {
    let connection;

    try {
        connection = await oracledb.getConnection();

        let artistID = req.query.artistID;

        let result = await connection.execute(
            `BEGIN
                delete_artist(:artistID);
             END;
             `, {
            artistID: artistID
        }

        )

    }
    catch (err) {
        console.log(err)
    }
    finally {
        try {
            res.redirect('/artists')
            await connection.close()
        }
        catch (err) {
            console.log(err.message)
        }
    }
}


module.exports = {
    listAllArtists,
    generateReport,
    renderForm,
    processForm,
    deleteArtist,
}
