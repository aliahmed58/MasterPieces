const listAllCustomers = (req, res) => {
    res.render('../src/views/customers/AllCustomers')
}

// generate report for the given customer id
const generateReport = (req, res) => {
    res.render('../src/views/customers/CustomerReport')
}

module.exports = {listAllCustomers, generateReport}