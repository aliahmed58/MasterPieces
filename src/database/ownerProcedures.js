// create schedule job to return painting if the painting is not rented since 6 months
// the job will be executed everyday and check if the following conditions are met:
// 1. If the painting status is available
// 2. If the painting months between last_use_date and sysdate is greater than 6 months
const returnUnrentedPaintingProcedure = async (connection) => {
    await connection.execute(
        `CREATE OR REPLACE PROCEDURE return_unrented AS
        month_diff NUMBER;
        BEGIN
            FOR record IN (SELECT * FROM paintings WHERE statusID = 'available')
            LOOP
                month_diff := TRUNC(ABS(MONTHS_BETWEEN(SYSDATE, record.last_use_date)));

                IF (month_diff > 6) THEN
                    UPDATE PAINTINGS SET
                    statusID = 'returned',
                    return_date = SYSDATE
                    WHERE paintingID = record.paintingID;

                    COMMIT;
                END IF;

                DBMS_OUTPUT.PUT_LINE(month_diff);
            END LOOP;
        END;`
    )
}

// resubmit painting 
const resubmitPaintingProcedure = async (connection) => {
    await connection.execute(
        `CREATE OR REPLACE PROCEDURE resubmit_painting(
            p_id NUMBER, o_id NUMBER
        ) AS
        BEGIN
            UPDATE PAINTINGS SET statusID = 'available',
            return_date = null,
            last_use_date = SYSDATE
            WHERE paintingID = p_id AND ownerID = o_id;
            COMMIT;
        END;`
    )
}

// create a trigger to check if painting being returned after 3 months
const checkReturnPaintingValidity = async (connectiton) => {
    // stops a hired painting from being returned in case tables update
    await connectiton.execute(
        `CREATE OR REPLACE TRIGGER check_valid_return
        BEFORE UPDATE ON PAINTINGS
        FOR EACH ROW
        DECLARE
            pragma autonomous_transaction;
            month_diff NUMBER;
        BEGIN
            IF (:old.statusID = 'hired' AND :new.statusID = 'returned') THEN
                RAISE_APPLICATION_ERROR(-20001, 'Painting currently hired, cannot return');
            END IF;

            -- check if 3 months have passed before the owner resubmits the painting
            -- find months between the return date and current date
            SELECT TRUNC(ABS(MONTHS_BETWEEN(SYSDATE, :old.return_date))) INTO month_diff FROM dual;

            IF (:old.statusID = 'returned' AND (:new.statusID = 'available' OR :new.statusID = 'hired') AND month_diff < 3) THEN
                RAISE_APPLICATION_ERROR(-20001, 'Three months need to pass before a painting can be resubmitted');
            END IF;

        END;`
    )
}   

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

// creates a procedure to insert an owner
const updateOwnerProcedure = async (connection) => {
    await connection.execute(
        `CREATE OR REPLACE PROCEDURE update_owner (
            o_id NUMBER,
            f_name VARCHAR, l_name VARCHAR,
            o_city VARCHAR, o_country VARCHAR,
            o_address VARCHAR, o_phone VARCHAR) AS
        BEGIN
            UPDATE OWNERS SET first_name = f_name, 
            last_name = l_name, 
            city = o_city, 
            country = o_country, 
            address = o_address, 
            cellphone = o_phone WHERE ownerID = o_id;

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

const generateReport = async (connection) => {
    await connection.execute(
        `CREATE OR REPLACE PROCEDURE get_owner_report (
            a_id IN NUMBER, records OUT SYS_REFCURSOR
        ) AS
        BEGIN
            -- Get all paintings owned by the owner regardless of status

            OPEN records FOR
            SELECT P.paintingID, P.name, P.statusID, P.return_date, P.last_use_date FROM 
            Paintings P INNER JOIN Owners O on P.ownerID = O.ownerID WHERE P.ownerId = a_id;

        END;`
    )
}

const createOwnerProcedures = async (connection) => {
    await insertOwnerProcedure(connection);
    await deleteOwnerProcedure(connection);
    await generateReport(connection);
    await checkReturnPaintingValidity(connection);
    await resubmitPaintingProcedure(connection);
    await returnUnrentedPaintingProcedure(connection);
    await updateOwnerProcedure(connection);
}

module.exports = createOwnerProcedures