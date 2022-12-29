// insert a new artist procedure
const insertArtistProcedure = async (connection) => {
    await connection.execute(
        `CREATE OR REPLACE PROCEDURE insert_artist (
            f_name VARCHAR, l_name VARCHAR, 
            a_country VARCHAR, a_dob DATE, 
            a_death DATE
            )
        IS
            age number;
            alive number;
        BEGIN

            IF a_death IS NULL THEN
                alive := 1;
            ELSE
                alive := 0;
            END IF;
        
            age := (EXTRACT(YEAR FROM SYSDATE) - EXTRACT(YEAR FROM a_dob));
            
            INSERT INTO ARTISTS (first_name, last_name, country, dob, death_date, alive, age) 
            VALUES (
                f_name, l_name, a_country, a_dob, a_death, alive, age
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