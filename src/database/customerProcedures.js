// create insert customer procedure
const insertCustomerProcedure = async (connection) => {
    await connection.execute(
        `CREATE OR REPLACE PROCEDURE insert_customer (c_name VARCHAR, c_address VARCHAR, c_description VARCHAR, c_category VARCHAR) AS
        BEGIN
            INSERT INTO CUSTOMERS (name, address, category_id, description) VALUES (
                c_name, c_address, c_category, c_description
            );
        END;`
    )
}

// create all procedures related to customers
const createCustomerProcedures = async (connection) => {
    await insertCustomerProcedure(connection);
}

module.exports = createCustomerProcedures
