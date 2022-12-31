const generatePrimaryKeyTrigger = async (connection) => {
    // create sequence
    await connection.execute(
        `CREATE SEQUENCE pk_sequence`
    )

    await connection.execute(
        `CREATE OR REPLACE TRIGGER on_rent_insert
            BEFORE INSERT ON rented
            FOR EACH ROW
        BEGIN
            SELECT pk_sequence.nextval
            INTO :new.rentID
            FROM dual;
        END;`
    )

    await connection.execute(
        `CREATE OR REPLACE TRIGGER on_painting_insert
            BEFORE INSERT ON paintings
            FOR EACH ROW
        BEGIN
            SELECT pk_sequence.nextval
            INTO :new.paintingID
            FROM dual;
        END;`
    )

    await connection.execute(
        `CREATE OR REPLACE TRIGGER on_customers_insert
            BEFORE INSERT ON customers
            FOR EACH ROW
        BEGIN
            SELECT pk_sequence.nextval
            INTO :new.customerID
            FROM dual;
        END;`
    )

    await connection.execute(
        `CREATE OR REPLACE TRIGGER on_artists_insert
            BEFORE INSERT ON artists
            FOR EACH ROW
        BEGIN
            SELECT pk_sequence.nextval
            INTO :new.artistID
            FROM dual;
        END;`
    )

    await connection.execute(
        `CREATE OR REPLACE TRIGGER on_owner_insert
            BEFORE INSERT ON owners
            FOR EACH ROW
        BEGIN
            SELECT pk_sequence.nextval
            INTO :new.ownerID
            FROM dual;
        END;`
    )

}

const createCommonTriggers = async (connection) => {
    await generatePrimaryKeyTrigger(connection);
}

module.exports = createCommonTriggers;