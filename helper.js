/* 
Since oracle has the date format DD-MON-YY and HTML produces date of format YYYY-MM-DD
The date needs to be converted so it can be used in Oracle PL/SQL

Param: date in format YYYY-MM-DD
Return: date in format DD-MON-YY
*/

const convertDate = (date) =>{
    let months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
    
    splitted_date = date.split("-")

    let year = splitted_date[0];
    let month = splitted_date[1];
    let day = splitted_date[2];

    // access month from the list months using month - 1 as index
    let oracle_month = months[month - 1]
    let oracle_year = year.slice(2, 4);
    let oracle_day = day

    let oracle_date = `${oracle_day}-${oracle_month}-${oracle_year}`

    return oracle_date
}

module.exports = {convertDate}