const listAllOwners = (req, res) => {
    res.render('../src/views/owners/AllOwners')
}

// generates report for the given owner id
const generateReport = (req, res) => {

    info = {
        'id': 1,
        'name': 'Salman Ahmed',
        'address': 'L215, Sector 5M, North Karachi'
    }

    report_info = [
        {
            'painting_no': 1,
            'painting_title': 'Puta de caprice',
            'return_date': '10-22-12'
        },
        {
            'painting_no': 2,
            'painting_title': 'Evando de apre',
            'return_date': '10-22-12'
        },
        {
            'painting_no': 3,
            'painting_title': 'Someande tpre',
            'return_date': '10-22-12'
        },
        {
            'painting_no': 5,
            'painting_title': 'Banana',
            'return_date': '10-22-12'
        }
    ]
    
    data = {
        info, report_info
    }

    res.render('../src/views/owners/OwnerReport', data)
}

// render input form
const renderForm = (req, res) => {
    res.render('../src/views/owners/NewOwner')
}

module.exports = {listAllOwners, generateReport, renderForm}