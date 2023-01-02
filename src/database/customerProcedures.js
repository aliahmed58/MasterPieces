// delete customer trigger
// whenever a customer is deleted, all paintings in his hiring
// should be returned and set as available
const deleteCustomerTrigger = async (connection) => {
    await connection.execute(
        `CREATE OR REPLACE TRIGGER delete_customer_trigger 
        AFTER DELETE ON CUSTOMERS
        FOR EACH ROW
        DECLARE
            pragma autonomous_transaction;
            p_id NUMBER;
        BEGIN
            UPDATE PAINTINGS SET statusID = 'available' WHERE paintingID IN (SELECT paintingID FROM rented WHERE customerID = :old.customerID);

            COMMIT;
        END;`
            
    )
}

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

const updateCustomerProcedure = async (connection) => {
    await connection.execute(
        `CREATE OR REPLACE PROCEDURE update_customer (
            c_id NUMBER,
            f_name VARCHAR, l_name VARCHAR,
            c_city VARCHAR, c_country VARCHAR,
            c_address VARCHAR, c_categoryID VARCHAR,
            c_description VARCHAR) 
            AS
        BEGIN
            UPDATE CUSTOMERS SET first_name = f_name, 
            last_name = l_name, 
            city = c_city, country = c_country, 
            address = c_address, 
            categoryID = c_categoryID, 
            description = c_description WHERE customerID = c_id;
            
            COMMIT;
        END;`
    )
}

// procedure to delete a customer given its id
const deleteCustomerProcedure = async (connection) => {
    await connection.execute(
        `CREATE OR REPLACE PROCEDURE delete_customer(id number) AS
        BEGIN
            DELETE FROM CUSTOMERS WHERE customerID = id;
            COMMIT;
        END;` 
    )
}

// procedure to generate customer report
const generateReportProcedure = async (connection) => {
    await connection.execute(
        `CREATE OR REPLACE PROCEDURE get_customer_report (
            id IN NUMBER, records OUT SYS_REFCURSOR
        ) AS
        BEGIN
            OPEN records FOR
            SELECT 
            
            C.customerID, C.first_name, C.last_name, C.city, C.country, C.address, C.description,
            L.categoryname, L.discount,
            P.paintingID, P.name, P.theme, R.RENT_DATE, R.due_date, R.returned, R.CUSTOMER_RETURN_DATE

            FROM RENTED R 
                INNER JOIN PAINTINGS P ON R.paintingID = P.paintingID
                INNER JOIN CUSTOMERS C ON C.customerID = R.customerID
                INNER JOIN CATEGORY L ON C.categoryID = L.categoryID
                WHERE C.customerID = id;
        END;`
    )
}

const returnPaintingProcedure = async (connection) => {
    await connection.execute(
        `CREATE OR REPLACE PROCEDURE customer_return_painting (
            c_id NUMBER, p_id NUMBER
        ) AS
        BEGIN
            UPDATE RENTED SET returned = 1, customer_return_date = SYSDATE 
            WHERE customerID = c_id AND paintingID = p_id;

            UPDATE PAINTINGS SET statusID = 'available' WHERE paintingID = p_id;

            COMMIT;
        END;`
    )
}


// create all procedures related to customers
const createCustomerProcedures = async (connection) => {
    await insertCustomerProcedure(connection);
    await deleteCustomerProcedure(connection);
    await generateReportProcedure(connection);
    await returnPaintingProcedure(connection);
    await deleteCustomerTrigger(connection);
    await updateCustomerProcedure(connection);
}

module.exports = createCustomerProcedures
