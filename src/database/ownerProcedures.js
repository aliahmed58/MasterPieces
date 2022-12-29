// creates a procedure to insert an owner
const insertOwnerProcedure = async (connection) => {
    await connection.execute(
        `CREATE OR REPLACE PROCEDURE insert_owner (
            f_name VARCHAR, l_name VARCHAR,
            o_city VARCHAR, o_country VARCHAR,
            o_address VARCHAR, o_phone VARCHAR) AS
        BEGIN
            INSERT INTO OWNERS (first_name, last_name, city, country, address, cellphone) 
            VALUES (f_name, l_name, o_city, o_country, o_address, o_phone);
            COMMIT;
        END;
        `
    )
}   

const deleteOwnerProcedure = async (connection) => {
    await connection.execute(
        `CREATE OR REPLACE PROCEDURE delete_owner (id NUMBER) AS
        BEGIN
            DELETE FROM OWNERS WHERE ownerID = id;
            COMMIT;
        END;`
    )
}

const createOwnerProcedures = async (connection) => {
    await insertOwnerProcedure(connection);
    await deleteOwnerProcedure(connection);
}

module.exports = createOwnerProcedures