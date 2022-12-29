const insertPaintingProcedure = async (connection) => {
    await connection.execute(
        `CREATE OR REPLACE PROCEDURE insert_painting(
            p_name VARCHAR, rental NUMBER, p_theme VARCHAR, a_id NUMBER, o_id NUMBER) AS
        BEGIN
            INSERT INTO PAINTINGS (name, monthly_rental, theme, artistID, ownerID) 
            VALUES (p_name, rental, p_theme, a_id, o_id);

            COMMIT;
        END;`
    )
}

const deletePaintingProcedure = async (connection) => {
    connection.execute(
        `CREATE OR REPLACE PROCEDURE delete_painting (id NUMBER) AS
        BEGIN
            DELETE FROM PAINTINGS WHERE paintingID = id;

            COMMIT;
        END;`
    )
}

const createPaintingProcedures = async (connection) => {
    await insertPaintingProcedure(connection);
    await deletePaintingProcedure(connection);
}

module.exports = createPaintingProcedures