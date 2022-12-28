const dropAllTables = async (connection) => {
    // drop all tables in the beginning 
    await connection.execute('DROP TABLE OWNERS')
    await connection.execute('DROP TABLE ARTISTS')
    await connection.execute('DROP TABLE CATEGORY')
}

const insertDefaultValues = async (connection) => {
    // insert values for cateogry table
    await connection.execute(`INSERT INTO CATEGORY VALUES ('bronze', 0)`)
    await connection.execute(`INSERT INTO CATEGORY VALUES ('silver', 0.05)`)
    await connection.execute(`INSERT INTO CATEGORY VALUES ('gold', 0.1)`)
    await connection.execute(`INSERT INTO CATEGORY VALUES ('platinum', 0.15)`)

}

const createTables = async (connection) => {

    // call drop all tables
    dropAllTables(connection)

    // CREATE OWNER TABLE
    await connection.execute(
        `CREATE TABLE OWNERS (
            ownerID number generated always as identity,
            name varchar(60),
            address varchar(100)
        )`
    )

    // CREATE ARTIST TABLE
    await connection.execute(
        `CREATE TABLE ARTISTS (
            artistID number generated always as identity, 
            name varchar(60),
            country varchar(30),
            dob DATE,
            age NUMBER
        )`
    )

    // CREATE CATEOGRY TABLE
    await connection.execute(
        `CREATE TABLE CATEGORY (
            category varchar(30) PRIMARY KEY, 
            discount NUMBER(6, 2)
        )`
    )

    // insert constant values in tables where needed
    await insertDefaultValues(connection)
    
}



module.exports = createTables