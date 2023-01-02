// create trigger for date of birth
const checkDobTrigger = async (connection) => {
    await connection.execute(
        `CREATE OR REPLACE TRIGGER check_dob
        BEFORE INSERT OR UPDATE ON ARTISTS
        FOR EACH ROW
        BEGIN
            IF (:new.dob > SYSDATE OR :new.dob > :new.death_date OR :new.death_date >= SYSDATE) THEN
            RAISE_APPLICATION_ERROR(-20001, 'Invalid date of birth or date of death');
            END IF;
        END;`
    )
}

// Runs in the scheduler job and updates age of artists
const updateAgeProcedure = async (connection) => {
    await connection.execute(
        `CREATE OR REPLACE PROCEDURE update_age AS
        age_val NUMBER;
        BEGIN
            FOR artist IN (SELECT * FROM ARTISTS WHERE death_date IS NOT NULL)
            LOOP
                age_val := CEIL(ABS(MONTHS_BETWEEN(SYSDATE, a_dob)) / 12);
                UPDATE ARTISTS set age = age_val WHERE artistID = artist.artistID;
            END LOOP;
            COMMIT;
        END;`
    )
}

// update artist info procedure
const updateArtist = async (connection) => {
    await connection.execute(
        `CREATE OR REPLACE PROCEDURE update_artist (
            a_id NUMBER,
            f_name VARCHAR, l_name VARCHAR, 
            a_country VARCHAR, a_dob DATE, 
            a_death DATE
            )
        IS
            age_val number;
            alive_bool number;
        BEGIN

            IF a_death IS NULL THEN
                age_val := CEIL(ABS(MONTHS_BETWEEN(SYSDATE, a_dob)) / 12);
                alive_bool := 1; 
            ELSE
                alive_bool := 0;
                age_val := CEIL(ABS(MONTHS_BETWEEN(a_death, a_dob)) / 12);
            END IF;
        
            UPDATE ARTISTS 
            SET first_name = f_name, 
            last_name = l_name,
            country = a_country, 
            dob = TRUNC(a_dob),
            death_date = TRUNC(a_death), alive = alive_bool, age = age_val 
            WHERE artistID = a_id;

            COMMIT;

        END;`
    )
}


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
                age := CEIL(ABS(MONTHS_BETWEEN(SYSDATE, a_dob)) / 12);
                alive := 1; 
            ELSE
                alive := 0;
                age := CEIL(ABS(MONTHS_BETWEEN(a_death, a_dob)) / 12);
            END IF;
        
            INSERT INTO ARTISTS (first_name, last_name, country, dob, death_date, alive, age) 
            VALUES (
                f_name, l_name, a_country, TRUNC(a_dob), TRUNC(a_death), alive, age
            );

            COMMIT;

        END;
        `
    )
}

// deleting artists - procedure
const deleteArtistProcedure = async (connection) => {
    await connection.execute(
        `CREATE OR REPLACE PROCEDURE delete_artist (a_id NUMBER) AS
        BEGIN
            DELETE FROM ARTISTS WHERE artistID = a_id;
                
            COMMIT;
        END;`
    )
}

const generateReportProcedure = async (connection) => {
    await connection.execute(
        `CREATE OR REPLACE PROCEDURE get_artist_report (
            id IN NUMBER, records OUT SYS_REFCURSOR
        ) AS
        BEGIN
            OPEN records FOR
            SELECT 
            A.artistID, A.first_name, A.last_name, A.dob, A.age, A.death_date, 
            A.country, P.paintingID, P.name, P.theme, P.monthly_rental, 
            O.ownerID, O.first_name, O.last_name, O.cellphone
        FROM PAINTINGS P
            INNER JOIN OWNERS O ON P.ownerID = O.ownerID
            INNER JOIN ARTISTS A ON P.artistID = A.artistID
            WHERE A.artistID = id;
        END;`
    )
}

const createArtistProcedures = async (connection) => {
    await insertArtistProcedure(connection)
    await deleteArtistProcedure(connection)
    await checkDobTrigger(connection)
    await generateReportProcedure(connection)
    await updateAgeProcedure(connection);
    await updateArtist(connection);
}

module.exports = createArtistProcedures