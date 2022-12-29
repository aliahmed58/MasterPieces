const dropAllTables = async (connection) => {
    // drop all tables in the beginning 
    await connection.execute('DROP TABLE RENTED');
    await connection.execute('DROP TABLE PAINTINGS');
    await connection.execute('DROP TABLE CUSTOMERS');
    await connection.execute('DROP TABLE ARTISTS');
    await connection.execute('DROP TABLE OWNERS');
    await connection.execute('DROP TABLE CATEGORY');
}

const insertDefaultValues = async (connection) => {
    // insert values for cateogry table
    await connection.execute(`INSERT INTO CATEGORY VALUES ('B', 'bronze', 0)`);
    await connection.execute(`INSERT INTO CATEGORY VALUES ('S', 'silver', 0.05)`);
    await connection.execute(`INSERT INTO CATEGORY VALUES ('G', 'gold', 0.1)`);
    await connection.execute(`INSERT INTO CATEGORY VALUES ('P', 'platinum', 0.15)`);

}

const createTables = async (connection) => {

    // CREATE OWNER TABLE
    await connection.execute(
        `CREATE TABLE OWNERS (
            ownerID number generated always as identity PRIMARY KEY,
            first_name varchar(20) NOT NULL,
            last_name varchar(20) NOT NULL, 
            city varchar(20) NOT NULL, 
            country varchar(20) NOT NULL,
            address varchar(100) NOT NULL,
            cellphone varchar(12) NOT NULL,
            CONSTRAINT phone_check CHECK (length(cellphone) >= 10)
        )`
    )

     // CREATE ARTIST TABLE
     await connection.execute(
        `CREATE TABLE ARTISTS (
            artistID number generated always as identity PRIMARY KEY, 
            first_name varchar(20) NOT NULL,
            last_name varchar(20) NOT NULL,
            country varchar(20) NOT NULL,
            dob DATE NOT NULL,
            death_date DATE DEFAULT NULL,
            alive NUMBER(1) DEFAULT 1,
            age NUMBER NOT NULL
        )`
    )

    // CREATE PAINTING TABLE
    await connection.execute(
        `CREATE TABLE PAINTINGS(
            paintingID NUMBER generated always as identity PRIMARY KEY, 
            name varchar(20) NOT NULL,
            monthly_rental NUMBER(6, 2) NOT NULL,
            theme varchar(20) NOT NULL,
            artistID NUMBER NOT NULL,
            ownerID NUMBER NOT NULL,
            CONSTRAINT fk_artist FOREIGN KEY (artistID) REFERENCES ARTISTS(artistID) ON DELETE CASCADE,
            CONSTRAINT fk_owner FOREIGN KEY (ownerID) REFERENCES OWNERS(ownerID) ON DELETE CASCADE
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
            customerID number generated always as identity PRIMARY KEY, 
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
            rentID NUMBER generated always as identity PRIMARY KEY, 
            rent_date DATE NOT NULL,
            due_date DATE NOT NULL, 
            returned NUMBER(1) NOT NULL,
            return_date DATE NOT NULL,
            customerID NUMBER NOT NULL,
            paintingID NUMBER NOT NULL,
            CONSTRAINT fk_customer FOREIGN KEY(customerID) REFERENCES CUSTOMERS(customerID) ON DELETE CASCADE,
            CONSTRAINT fk_painting FOREIGN KEY(paintingID) REFERENCES PAINTINGS(paintingID) ON DELETE CASCADE
        )`
    )

}



module.exports = {dropAllTables, createTables, insertDefaultValues}