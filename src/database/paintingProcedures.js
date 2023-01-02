// ------ TRIGGERS ------

const checkDatesTrigger = async (connection) => {
    await connection.execute(
        `CREATE OR REPLACE TRIGGER check_rent_dates
        BEFORE INSERT OR UPDATE ON RENTED
        FOR EACH ROW
        BEGIN
            IF (:new.rent_date > :new.due_date) THEN
                RAISE_APPLICATION_ERROR(-20001, 'Invalid rent date or return date');
                END IF;
            END;`
    )
}


// ------ PROCEDURES ------
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

const updatePaintingProcedure = async (connection) => {
    await connection.execute(
        `CREATE OR REPLACE PROCEDURE update_painting(p_id NUMBER,
            p_name VARCHAR, rental NUMBER, p_theme VARCHAR, a_id NUMBER, o_id NUMBER) AS

        rent_price NUMBER(38, 2);
        original_price NUMBER(38, 2);
        discount_percentage NUMBER(6, 2);
        painting_status VARCHAR(20);

        BEGIN

            SELECT discount INTO discount_percentage FROM category 
            WHERE categoryID = (SELECT categoryID FROM customers 
                        WHERE customerID = (SELECT customerID FROM rented WHERE paintingID = p_id AND
                            customer_return_date IS NULL));

            UPDATE PAINTINGS SET name = p_name, 
            monthly_rental = rental, 
            theme = p_theme, 
            artistID = a_id, 
            ownerID = o_id
            WHERE paintingID = p_id;

            -- get original monthly rental of the painting

            SELECT monthly_rental INTO original_price FROM paintings WHERE
            paintingID = p_id;

            -- Calculate discounted price
            rent_price := original_price * (1 - discount_percentage);

            UPDATE RENTED SET monthly_rent = rent_price WHERE paintingID = p_id AND customer_return_date IS NULL;

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

const getAvailablePaintingsProcedure = async (connection) => { 
    await connection.execute(
        `CREATE OR REPLACE PROCEDURE get_available_paintings (records OUT SYS_REFCURSOR) AS
        BEGIN
            OPEN records FOR
            SELECT
            * FROM PAINTINGS 
            WHERE statusID = 'available';
        END;
                `
    )
}

const rentPaintingProcedure = async (connection) => {
    await connection.execute(
        `CREATE OR REPLACE PROCEDURE rent_painting (
            rentdate DATE, duedate DATE, c_id NUMBER, p_id NUMBER
        ) AS
        rent_price NUMBER(38, 2);
        original_price NUMBER(38, 2);
        discount_percentage NUMBER(6, 2);
        painting_status VARCHAR(20);
        BEGIN
            -- get painting status, if its not available, do not let it insert
            SELECT statusID INTO painting_status FROM paintings WHERE paintingID = p_id;

            IF (painting_status != 'available') THEN
                RAISE_APPLICATION_ERROR(-20001, 'Painting not available to rent');
            END IF;

            -- Calculate rent price based on customer discount

            SELECT discount INTO discount_percentage FROM category WHERE 
            categoryID = (SELECT categoryID FROM customers WHERE customerID = c_id);

            -- get original monthly rental of the painting

            SELECT monthly_rental INTO original_price FROM paintings WHERE
            paintingID = p_id;

            -- Calculate discounted price
            rent_price := original_price * (1 - discount_percentage);

            INSERT INTO RENTED (rent_date, due_date, returned, monthly_rent, customerID, paintingID)
            VALUES (rentdate, duedate, 0, rent_price, c_id, p_id);

            -- Update status to current hired AND last_use_date to sysdate
            UPDATE PAINTINGS SET statusID = 'hired', last_use_date = SYSDATE WHERE paintingID = p_id;


            COMMIT;
        END;`
    )
}

// Testing purposes to avoid the 6 month gap
const returnPaintingToOwnerProcedure = async (connection) => {
    await connection.execute(
        `CREATE OR REPLACE PROCEDURE return_to_owner (p_id NUMBER) AS
        BEGIN
            UPDATE PAINTINGS SET statusID = 'returned', return_date = SYSDATE WHERE paintingID = p_id;
            COMMIT;
        END;`
    )
}

const createPaintingProcedures = async (connection) => {
    await insertPaintingProcedure(connection);
    await deletePaintingProcedure(connection);
    await getAvailablePaintingsProcedure(connection);
    await rentPaintingProcedure(connection);
    await checkDatesTrigger(connection);
    await returnPaintingToOwnerProcedure(connection);
    await updatePaintingProcedure(connection);
}

module.exports = createPaintingProcedures