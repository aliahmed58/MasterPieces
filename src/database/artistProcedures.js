// insert a new artist procedure
const insertArtistProcedure = async (connection) => {
    await connection.execute(
        `CREATE OR REPLACE PROCEDURE insert_artist (a_name VARCHAR, a_country VARCHAR, a_dob DATE)
        IS
            age number;
        BEGIN
        
            age := (EXTRACT(YEAR FROM SYSDATE) - EXTRACT(YEAR FROM a_dob));
            
            INSERT INTO ARTISTS (name, country, dob, age) VALUES (
                a_name, a_country, a_dob, age
            );

            COMMIT;

        END;
        `
    )
}

const createArtistProcedures = async (connection) => {
    await insertArtistProcedure(connection)
}

module.exports = createArtistProcedures