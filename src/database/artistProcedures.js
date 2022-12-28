// insert a new artist procedure
const insertArtistProcedure = async (connection) => {
    await connection.execute(
        `CREATE OR REPLACE PROCEDURE new_artist (a_name VARCHAR, a_country VARCHAR, a_dob DATE)
        IS
            age number;
        BEGIN
        
            SELECT (EXTRACT(YEAR FROM SYSDATE) - EXTRACT(YEAR FROM a_dob)) INTO age;
            
            INSERT INTO ARTISTS (name, country, dob, age) VALUES (
                a_name, a_country, '12-JUN-22', age
            )

            COMMIT;

        END;
        `
    )
}

const createArtistProcedures = async (connection) => {
    await insertArtistProcedure(connection)
}

module.exports = createArtistProcedures