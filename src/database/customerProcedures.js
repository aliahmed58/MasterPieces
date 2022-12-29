// create insert customer procedure
const insertCustomerProcedure = async (connection) => {
    await connection.execute(
        `CREATE OR REPLACE PROCEDURE insert_customer (
            f_name VARCHAR, l_name VARCHAR,
            c_city VARCHAR, c_country VARCHAR,
            c_address VARCHAR, c_categoryID VARCHAR,
            c_description VARCHAR) 
            AS
        BEGIN
            INSERT INTO CUSTOMERS (first_name, last_name, city, country, address, categoryID, description) VALUES (
                f_name, l_name, c_city, c_country, c_address, c_categoryID, c_description);
            
            COMMIT;
        END;`
    )
}

const deleteCustomerProcedure = async (connection) => {
    await connection.execute(
        `CREATE OR REPLACE PROCEDURE delete_customer(id number) AS
        BEGIN
            DELETE FROM CUSTOMERS WHERE customerID = id;
            COMMIT;
        END;` 
    )
}

// create all procedures related to customers
const createCustomerProcedures = async (connection) => {
    await insertCustomerProcedure(connection);
    await deleteCustomerProcedure(connection);
}

module.exports = createCustomerProcedures
