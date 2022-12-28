// creates a procedure to insert an owner
const insertOwnerProcedure = async (connection) => {
    await connection.execute(
        `CREATE OR REPLACE PROCEDURE insert_owner (owner_name VARCHAR, owner_address VARCHAR) AS
        BEGIN
            INSERT INTO OWNERS (NAME, ADDRESS) VALUES (owner_name, owner_address);
            COMMIT;
        END;
        `
    )
}   

const createOwnerProcedures = async (connection) => {
    insertOwnerProcedure(connection);
}

module.exports = createOwnerProcedures