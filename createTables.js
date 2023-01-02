// drop a scheduled job if exists
const dropJobIfExists = async (connection, job_name) => {
    await connection.execute(
        `BEGIN
        DBMS_SCHEDULER.drop_job(:job_name);
        EXCEPTION
            WHEN OTHERS THEN
            IF SQLCODE != -27475 THEN
                RAISE;
            END IF;
        END;`, [job_name]
    )
}

// drop a table if it exists SQL 
const dropTableIfExists = async (connection, table_name) => {

    // drop the pk sequence if exists
    await connection.execute(
        `BEGIN
            EXECUTE IMMEDIATE 'DROP SEQUENCE pk_sequence';
        EXCEPTION
            WHEN OTHERS THEN
            IF SQLCODE != -2289 THEN
                RAISE;
          END IF;
        END;`
    )
    await connection.execute(
        `BEGIN
            EXECUTE IMMEDIATE 'DROP TABLE ' || :table_name;
        EXCEPTION
            WHEN OTHERS THEN
                IF SQLCODE != -942 THEN
                    RAISE;
                END IF;
        END;`, [table_name]
    )
}

const dropAllTablesIfExist = async (connection) => {
    // drop all tables in the beginning 
    await dropTableIfExists(connection, 'RENTED');
    await dropTableIfExists(connection, 'PAINTINGS');
    await dropTableIfExists(connection, 'STATUS');
    await dropTableIfExists(connection, 'CUSTOMERS');
    await dropTableIfExists(connection, 'ARTISTS');
    await dropTableIfExists(connection, 'OWNERS');
    await dropTableIfExists(connection, 'CATEGORY');

    // drop jobs if exist
    await dropJobIfExists(connection, 'return_to_owner_job');
    await dropJobIfExists(connection, 'update_artist_age_job');
}

const insertDefaultValues = async (connection) => {
    // insert values for cateogry table
    await connection.execute(
        `BEGIN
        INSERT INTO CATEGORY VALUES ('B', 'bronze', 0);
        INSERT INTO CATEGORY VALUES ('S', 'silver', 0.05);
        INSERT INTO CATEGORY VALUES ('G', 'gold', 0.1);
        INSERT INTO CATEGORY VALUES ('P', 'platinum', 0.15);
        COMMIT;
        END;`);

    await connection.execute(
        `BEGIN
            INSERT INTO STATUS VALUES ('returned');
            INSERT INTO STATUS VALUES ('hired');
            INSERT INTO STATUS VALUES ('available');
        COMMIT;
        END;`
    )

}

const createTables = async (connection) => {

    // DROP ALL TABLES IN THE START (FOR TESTING ONLY)
    await dropAllTablesIfExist(connection);

    await connection.execute(
        `CREATE SEQUENCE pk_sequence`
    )

    // CREATE return_to_owner_job JOB for checking everyday if 6 months have passed for a painting to go unrented;
    await connection.execute(
        `BEGIN
            DBMS_SCHEDULER.CREATE_JOB (
                job_name => 'return_to_owner_job',
                job_type => 'STORED_PROCEDURE',
                job_action => 'return_unrented',
                repeat_interval => 'FREQ=DAILY',
                auto_drop => FALSE,
                end_date => '02-JAN-2030 07.00.00 PM Australia/Sydney'
            );

            DBMS_SCHEDULER.CREATE_JOB (
                job_name => 'update_artist_age_job',
                job_type => 'STORED_PROCEDURE',
                job_action => 'update_age',
                repeat_interval => 'FREQ=SECONDLY',
                auto_drop => FALSE,
                end_date => '02-JAN-2030 07.00.00 PM Australia/Sydney'
            );
        END;`
    )

    // enable the job
    await connection.execute(
        `BEGIN
            DBMS_SCHEDULER.ENABLE('return_to_owner_job');
            DBMS_SCHEDULER.ENABLE('update_artist_age_job');
        END;`
    )

    // CREATE OWNER TABLE
    await connection.execute(
        `CREATE TABLE OWNERS (
            ownerID NUMBER PRIMARY KEY,
            first_name varchar(20) NOT NULL,
            last_name varchar(20) NOT NULL, 
            city varchar(20) NOT NULL, 
            country varchar(20) NOT NULL,
            address varchar(100) NOT NULL,
            cellphone varchar(12) NOT NULL,
            CONSTRAINT phone_min_length CHECK (length(cellphone) >= 11),
            CONSTRAINT phone_max_length CHECK (length(cellphone) <= 11)
        )`
    )

    // CREATE ARTIST TABLE
    await connection.execute(
        `CREATE TABLE ARTISTS (
            artistID NUMBER PRIMARY KEY, 
            first_name varchar(20) NOT NULL,
            last_name varchar(20) NOT NULL,
            country varchar(20) NOT NULL,
            dob DATE NOT NULL,
            death_date DATE DEFAULT NULL,
            alive NUMBER(1) DEFAULT 1,
            age NUMBER NOT NULL
        )`
    )

    // CREATE STATUS TABLE
    await connection.execute(
        `CREATE TABLE STATUS (
            status_id VARCHAR(20) PRIMARY KEY
        )`
    )

    // CREATE PAINTING TABLE
    await connection.execute(
        `CREATE TABLE PAINTINGS(
            paintingID NUMBER PRIMARY KEY, 
            name varchar(20) NOT NULL,
            monthly_rental NUMBER(38, 2) NOT NULL,
            theme varchar(20) NOT NULL,
            artistID NUMBER NOT NULL,
            ownerID NUMBER NOT NULL,
            statusID VARCHAR(20) DEFAULT 'available' NOT NULL,
            last_use_date DATE DEFAULT SYSDATE NOT NULL,
            return_date DATE,
            CONSTRAINT fk_artist FOREIGN KEY (artistID) REFERENCES ARTISTS(artistID) ON DELETE CASCADE,
            CONSTRAINT fk_owner FOREIGN KEY (ownerID) REFERENCES OWNERS(ownerID) ON DELETE CASCADE,
            CONSTRAINT fk_status FOREIGN KEY (statusID) REFERENCES STATUS(status_id)
        )`
    )



    // CREATE CATEOGRY TABLE
    await connection.execute(
        `CREATE TABLE CATEGORY (
            categoryID VARCHAR(1) PRIMARY KEY,
            categoryName VARCHAR(20) NOT NULL,
            discount NUMBER(6, 2) NOT NULL
        )`
    )

    //  CREATE CUSTOMER TABLE
    await connection.execute(
        `CREATE TABLE CUSTOMERS (
            customerID number PRIMARY KEY, 
            first_name varchar(20) NOT NULL,
            last_name varchar(20) NOT NULL,
            city varchar(20) NOT NULL,
            country varchar(20) NOT NULL,
            address varchar(100) NOT NULL,  
            categoryID VARCHAR(1) NOT NULL,
            description varchar(100) NOT NULL,
            CONSTRAINT fk_cateogry FOREIGN KEY (categoryID) REFERENCES CATEGORY(categoryID)
        )`
    )

    // CREATE RENTED TABLE
    await connection.execute(
        `CREATE TABLE RENTED (
            rentID NUMBER PRIMARY KEY, 
            rent_date DATE NOT NULL,
            due_date DATE NOT NULL, 
            returned NUMBER(1) DEFAULT 0 NOT NULL,
            customer_return_date DATE,
            monthly_rent NUMBER(38, 2) NOT NULL,
            customerID NUMBER NOT NULL,
            paintingID NUMBER NOT NULL,
            CONSTRAINT fk_customer FOREIGN KEY(customerID) REFERENCES CUSTOMERS(customerID) ON DELETE CASCADE,
            CONSTRAINT fk_painting FOREIGN KEY(paintingID) REFERENCES PAINTINGS(paintingID) ON DELETE CASCADE
        )`
    )

    await insertDefaultValues(connection);

}



module.exports = createTables