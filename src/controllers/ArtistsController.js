const {convertDate} = require('../../helper')
const oracledb = require('oracledb')

/*
 ******** Helper functions below ********
 * Fetching data from database 
 * Storing data in database
*/

const getArtistData = async (connection, artistID) => {
    const result = await connection.execute(
        `SELECT * FROM ARTISTS 
        WHERE ARTISTID = :artistID`,
        [artistID]
    )

    return result.rows[0];
}

// ----- Exported functions below -----

// show all artists in a list
const listAllArtists = async (req, res) => {
    let connection;
    let result;

    try {
        connection = await oracledb.getConnection();

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
            res.render('../src/views/artists/AllArtists', {data: result.rows})
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

    try {
        connection = await oracledb.getConnection();

        // get artist data
        result = await getArtistData(connection, req.query.artistID)
        
    }
    catch (err) {
        console.log(err)
    }

    finally {
        try {
            
            res.render('../src/views/artists/ArtistReport', {data: result})       
             
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
    res.render('../src/views/artists/NewArtist')
}

// process input form
const processForm = async (req, res) => {

    let connection;
    let {firstname, lastname, country, dob, dod} = req.body;

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

const deleteArtist = async (req, res) => {
    let connection;
    
    try {
        connection = await oracledb.getConnection()

        let artistID = req.query.artistID;

        let result = await connection.execute(
            `BEGIN
                delete_artist(:artistID);
             END;
             `,{
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
        catch(err) {
            console.log(err.message)
        }
    }
}

module.exports = {
    listAllArtists,
    generateReport,
    renderForm,
    processForm,
    deleteArtist
}
